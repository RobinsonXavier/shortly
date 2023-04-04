import bcrypt, { compareSync } from 'bcrypt';
import {v4 as uuid} from 'uuid';

import { connection } from "../database/db.js";
import {signupSchema, singinSchema} from '../schemas/authSchema.js';

async function signupAccount (req, res) {
    const {username, email, password, confirmPassword} = req.body;

    const validation = signupSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    if(confirmPassword !== password) {
        return res.status(422).send('Password and Confirm Password must be the same');
    }

    try {

        const findEmail = await connection.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        
        if (findEmail.rows[0]) {
            return res.status(409).send('email already used');
        }

        const findName = await connection.query(`SELECT * FROM users where username = $1;`, [username]);

        if (findName.rows[0]) {
            return res.status(409).send('username already used');
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        await connection.query(`INSERT INTO users (username, email, password, "linkCount", "visitCount") VALUES ($1, $2, $3, $4, $5);`, 
        [username, email, hashPassword, 0, 0]);
        
        res.sendStatus(201);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

async function signinAccount (req, res) {
    const {email, password} = req.body;

    const validation = singinSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        
        const checkUser = await connection.query(`SELECT * FROM users where email = $1;`, [email]);

        if (!checkUser.rows[0]) {
            return res.status(401).send('email ou senha inválidos')
        } 

        const verifyPassword = bcrypt.compareSync(password, checkUser.rows[0].password);

        if(!verifyPassword) {
            return res.status(401).send('email ou senha inválidos')
        }

        const token = uuid();

        await connection.query(`INSERT INTO sessions ("userId", token, "lastStatus") VALUES ($1, $2, $3);`, 
        [checkUser.rows[0].id, token, Date.now()]);
        
        return res.status(200).send({
            userId: checkUser.rows[0].id,
            name: checkUser.rows[0].username,
            token
        });


    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

async function updateSessionStatus (req, res) {
    const { authorization, user } = req.headers;

    const token = authorization?.replace('Bearer ', '');
    
    try {
        const session = await connection.query('SELECT * FROM sessions WHERE "userId" = $1;', [user]);

        if(token !== session.rows[0].token) {
            return res.status(401).send('acesso não autorizado');
        }

        await connection.query('UPDATE sessions SET "lastStatus"= $1 WHERE "userId" = $2;', [Date.now(), user]);

        return res.status(200).send('Atualizado');
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function deleteOfflineSessions () {
    const lastStatusUpdate = Date.now() - 15*1000;

    try {
        await connection.query('DELETE FROM sessions WHERE "lastStatus" <= $1;', [lastStatusUpdate]);
        console.log('Atualizado');
    } catch (error) {
        console.log(error);
        return;
    }
}


export {
    signupAccount, 
    signinAccount,
    updateSessionStatus,
    deleteOfflineSessions
};
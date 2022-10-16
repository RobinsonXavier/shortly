import { connection } from "../database/db.js";
import bcrypt from 'bcrypt';
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

        const findEmail = await connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
        
        if (findEmail.rows[0]) {
            return res.sendStatus(409);
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        await connection.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`, [username, email, hashPassword]);
        
        res.sendStatus(201);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};
import { connection } from "../database/db.js";
import bcrypt from 'bcrypt';
import {signupSchema, singinSchema} from '../schemas/authSchema.js';

async function signupAccount (req, res) {
    const {username, email, password} = req.body;

    const validation = signupSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};
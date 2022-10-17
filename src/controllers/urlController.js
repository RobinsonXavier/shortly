import { nanoid } from "nanoid";

import { connection } from "../database/db.js";

async function postUrl (req, res) {
    const {authorization} = req.headers;
    const {url} = req.body;

    const token = authorization?.replace('Bearer ', '');

    const tryUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
    
    const verify = url.match(tryUrl);

    if(!verify) {
        return res.status(422).send('Put a valid url')
    }

    const shortened = nanoid();

    try {

        const session = await connection.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);

        if(!session) {
            return res.sendStatus(401);
        }
        
        await connection.query(`INSERT INTO shorteneds ("userId", url, "shortUrl") VALUES ($1, $2, $3);`, 
        [session.rows[0].userId, url, shortened]);

        res.status(200).send({
            shortUrl: shortened
        })

        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }


};

export {postUrl};
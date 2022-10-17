
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
        
        await connection.query(`INSERT INTO shorteneds ("userId", url, "shortUrl", accessed) VALUES ($1, $2, $3, $4);`, 
        [session.rows[0].userId, url, shortened, 0]);

        res.status(201).send({
            shortUrl: shortened
        })

        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }


};

async function getUrl (req, res) {
    const {id} = req.params;

    try {
        const searchUrl = await connection.query(`SELECT * FROM shorteneds WHERE id = $1;`, [id]);
        
        if(!searchUrl.rows[0]) {
            return res.sendStatus(404);
        }

        res.status(200).send({
            id,
            shortUrl: searchUrl.rows[0].shortUrl,
            url: searchUrl.rows[0].url
        })
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

async function acessUrl (req, res) {
    const {shortUrl} = req.params;

    try {
        const searchUrl = connection.query(`SELECT * FROM shorteneds where "shortUrl" = $1;`, [shortUrl]);

        if(!searchUrl.rows[0]) {
            return res.sendStatus(404);
        }

        const addOne = Number(searchUrl.rows[0].accessed) + 1;

        await connection.query(`UPDATE shorteneds SET accessed = $1 WHERE id = $2;`, [addOne, searchUrl.rows[0].id]);

        res.status(200);
        res.redirect(searchUrl.rows[0].url);
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

async function deleteUrl (req, res) {
    const {authorization} = req.headers;
    const {id} = req.params;

    const token = authorization?.replace('Bearer ', '');

    try {
        const check = connection.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);

        if(!check.rows[0]) {
            return res.sendStatus(401);
        }

        const shortened = await connection.query(`SELECT * FROM shorteneds WHERE id = $1;`, [id]);

        if (!shortened.rows[0]) {
            return res.sendStatus(404);
        }
        
        await connection.query(`DELETE FROM shorteneds WHERE id = $1;`, [id]);

        return res.sendStatus(204);
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};


export {postUrl , getUrl, acessUrl};
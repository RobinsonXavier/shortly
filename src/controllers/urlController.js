
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
        
        await connection.query(`INSERT INTO shorteneds ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4);`, 
        [session.rows[0].userId, url, shortened, 0]);

        const userVisits = (`SELECT * FROM visits WHERE "userId" = $1;`, [session.rows[0].userId]);

        if(!userVisits.rows[0]) {

            await connection.query(`INSERT INTO visits ("userId", "visitCount") VALUES ($1, $2);`, [session.rows[0].userId, 0]);

        }

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
        const searchUrl = await connection.query(`SELECT * FROM shorteneds WHERE "shortUrl" = $1;`, [shortUrl]);

        if(!searchUrl.rows[0]) {
            return res.sendStatus(404);
        }

        const user = searchUrl.rows[0].userId;

        const addOne = Number(searchUrl.rows[0].visitCount) + 1;

        const userVisits = await connection.query(`SELECT * FROM visits WHERE "userId" = $1;`, [user]);

        const addOneUserVisit = Number(userVisits.rows[0].visitCount) + 1;

        await connection.query(`UPDATE shorteneds SET "visitCount" = $1 WHERE id = $2;`, [addOne, searchUrl.rows[0].id]);

        await connection.query(`UPDATE visits SET "visitCount" = $1 WHERE "userId" = $2;`, [addOneUserVisit, user]);

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

        const userVisits = await connection.query(`SELECT * FROM visits WHERE "userId" = $1;`, [shortened.rows[0].userId]);

        const removeVisits = Number(userVisits.rows[0].visitCount) - Number(shortened.rows[0].visitCount);

        await connection.query(`UPDATE visits SET "visitCount" = $1 WHERE "userId" = $2;`, [removeVisits, shortened.rows[0].userId]);
        
        await connection.query(`DELETE FROM shorteneds WHERE id = $1;`, [id]);

        return res.sendStatus(204);
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};


export {postUrl , getUrl, acessUrl, deleteUrl};
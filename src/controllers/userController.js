import { connection } from "../database/db.js";

async function getUser (req, res) {
    const {authorization} = req.headers;

    const token = authorization?.replace('Bearer ', '');

    try {

        const check = await connection.query(`SELECT * FROM sesssions WHERE token = $1;`, [token]);

        if (!check.rows[0]) {
            return res.sendStatus(401);
        }

        const userData = await connection.query(`SELECT users.id as id, users.username as name, visits."visitCount" as "visitCount" FROM users JOIN visits ON users.id = visits."userId" WHERE users.id = $1;`, [check.rows[0].userId]);

        if (!userData) {
            return res.sendStatus(404);
        }

        const urls = await connection.query(`SELECT shorteneds.id as id, shorteneds.url as url, shorteneds."shortUrl" as "shortUrl, shorteneds."visitCount" as "visitCount" FROM shorteneds WHERE "userId" = $1;`, [check.rows[0].userId]);

        const obj = {
            id: userData.rows[0].id,
            name: userData.rows[0].name,
            visitCount: userData.rows[0].visitCount,
            shortenedUrls: urls.rows
        }

        res.status(200).send(obj);
        
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

async function getRanking (req, res) {

    try {

        const usersRanking = await connection.query(`SELECT users.id as id, users.username as name, users."linkCount" as "linkCount", users."visitCount" as "visitCount" FROM users LIMIT 10 GROUP BY visits."visitCount" DESC;`);

        res.status(200).send(usersRanking.rows);
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

export {getUser, getRanking};

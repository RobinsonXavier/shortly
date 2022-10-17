import { connection } from "../database/db.js";

async function getUser (req, res) {
    const {authorization} = req.headers;

    const token = authorization?.replace('Bearer ', '');

    try {

        const check = await connection.query(`SELECT * FROM sessions WHERE token = ${token};`);

        if (!check.rows[0]) {
            return res.sendStatus(401);
        }

        const userData = await connection.query(`SELECT users.id as id, users.username as name, users."visitCount" as "visitCount" FROM users WHERE users.id = $1;`, 
        [check.rows[0].userId]);

        if (!userData) {
            return res.sendStatus(404);
        }

        console.log(userData.rows)

        const urls = await connection.query(`SELECT * FROM shorteneds WHERE "userId" = $1;`, [check.rows[0].userId]);

        const newUrls = urls.rows.map(element => {
            const elementObj = {
                id: element.id,
                shortUrl: element.shortUrl,
                url: element.url,
                visitCount: element.visitCount
            }
            return elementObj
        })

        console.log(urls.rows)


        const obj = {
            id: userData.rows[0].id,
            name: userData.rows[0].name,
            visitCount: userData.rows[0].visitCount,
            shortenedUrls: newUrls
        }

        res.status(200).send(obj);
        
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

async function getRanking (req, res) {

    try {

        const usersRanking = await connection.query(`SELECT users.id as id, users.username as name, users."linkCount" as "linkCount", users."visitCount" as "visitCount" FROM users ORDER BY users."visitCount" DESC LIMIT 10;`);

        res.status(200).send(usersRanking.rows);
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

export {getUser, getRanking};

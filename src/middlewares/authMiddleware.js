import { connection } from "../database/db.js";

async function authToken (req, res) {
    const {authorization} = req.headers;

    const token = authorization?.replace('Bearer ', '');

    try {
        const session = await connection.query(`SELECT * FROM sessions WHERE sessions.token = ${token};`);

        if(!session.rows[0]) {
            return res.sendStatus(401);
        }

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
};

export {authToken};
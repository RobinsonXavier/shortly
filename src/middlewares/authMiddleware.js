import { connection } from "../database/db.js";

async function authToken (req, res, next) {
    const {authorization} = req.headers;

    const token = authorization?.replace('Bearer ', '');

    try {
        const session = await connection.query(`SELECT * FROM sessions WHERE sessions.token = $1;`, [token]);

        if(!session.rows[0]) {
            return res.sendStatus(401);
        }

        const userId = session.rows[0].userId;

        res.locals.userId = userId;

        return next();

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

};

export {authToken};
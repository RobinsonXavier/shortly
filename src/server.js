import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import urlRouter from './routers/urlRouter.js';
import userRouter from './routers/userRouter.js';
import { deleteOfflineSessions } from './controllers/authController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);

app.use(urlRouter);

app.use(userRouter);

setInterval(deleteOfflineSessions, 10000);

app.listen(process.env.PORT, ()=> {
    console.log("Server running on port " + process.env.PORT);
});
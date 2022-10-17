import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import urlRouter from './routers/urlRouter.js';
import userRouter from './routers/userRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);

app.use(urlRouter);

app.use(userRouter);

app.listen(4000, ()=> {
    console.log("Server on");
});
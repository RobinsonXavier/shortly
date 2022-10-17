import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import urlRouter from './routers/urlRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(urlRouter);

app.listen(4000, ()=> {
    console.log("Server on");
});
import express from 'express';

import { getRanking, getUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/users/me', getUser);

userRouter.get('/ranking', getRanking);

export default userRouter;
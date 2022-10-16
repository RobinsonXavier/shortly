import express from 'express';

import { signupAccount, signinAccount } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signupAccount);

authRouter.post('/signin', signinAccount);

export default authRouter;
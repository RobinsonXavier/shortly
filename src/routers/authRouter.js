import express from 'express';

import { 
  signupAccount, 
  signinAccount, 
  updateSessionStatus
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signupAccount);

authRouter.post('/signin', signinAccount);

authRouter.post('/status', updateSessionStatus);

export default authRouter;
import express from 'express';

import { postUrl } from '../controllers/urlController.js';

const urlRouter = express.Router();

urlRouter.post('/urls/shorten', postUrl);

export default urlRouter;
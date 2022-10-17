import express from 'express';

import { postUrl, getUrl, acessUrl, deleteUrl } from '../controllers/urlController.js';
import { authToken} from '../middlewares/authMiddleware.js';

const urlRouter = express.Router();

urlRouter.post('/urls/shorten', authToken, postUrl);

urlRouter.post('/urls/:id', getUrl);

urlRouter.post('/urls/open/:shortUrl', acessUrl);

urlRouter.delete('/urls/:id', authToken, deleteUrl);


export default urlRouter;
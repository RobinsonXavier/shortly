import express from 'express';

import { 
postUrl, 
getUrl, 
acessUrl, 
deleteUrl, 
getUrls 
} from '../controllers/urlController.js';
import { authToken } from '../middlewares/authMiddleware.js';

const urlRouter = express.Router();

urlRouter.post('/urls/shorten', authToken, postUrl);

urlRouter.get('/urls/:id', getUrl);

urlRouter.get('/urls', authToken, getUrls);

urlRouter.get('/urls/open/:shortUrl', acessUrl);

urlRouter.delete('/urls/:id', authToken, deleteUrl);


export default urlRouter;
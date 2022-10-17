import express from 'express';

import { postUrl, getUrl, acessUrl, deleteUrl } from '../controllers/urlController.js';

const urlRouter = express.Router();

urlRouter.post('/urls/shorten', postUrl);

urlRouter.post('/urls/:id', getUrl);

urlRouter.post('/urls/open/:shortUrl', acessUrl);

urlRouter.delete('/urls/:id', deleteUrl);


export default urlRouter;
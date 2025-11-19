import express from 'express';

import { userRouter } from './UserRouter.js';
import { chatRouter } from './ChatRouter.js';

const mainRouter = express.Router();

// user routes
mainRouter.use('/users', userRouter);

// chat routes
mainRouter.use('/chats', chatRouter);

export { mainRouter };

import express from 'express';

import { userRouter } from './UserRouter.js';
import { chatRouter } from './ChatRouter.js';
import { messageRouter } from './MessageRouter.js';

const mainRouter = express.Router();

// user routes
mainRouter.use('/users', userRouter);

// chat routes
mainRouter.use('/chats', chatRouter);

// message routes
mainRouter.use('/messages', messageRouter);

export { mainRouter };

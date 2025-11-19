import express from 'express';

import { userRouter } from './UserRouter.js';
import { chatRouter } from './ChatRouter.js';

const mainRouter = express.Router();

// user routes
mainRouter.use('/user', userRouter);

// chat routes
mainRouter.use('/chat', chatRouter);

export { mainRouter };

import express from 'express';

import { userRouter } from './UserRouter.js';

const mainRouter = express.Router();

// user routes
mainRouter.use('/user', userRouter);

export { mainRouter };

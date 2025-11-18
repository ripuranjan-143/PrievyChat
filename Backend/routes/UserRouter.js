import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import {
  signup,
  login,
  allUsers,
} from '../controllers/UserController.js';
import { signupSchema, loginSchema } from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import { verifyToken } from '../utils/AuthMiddleware.js';

const userRouter = express.Router();

// signup route
userRouter.post(
  '/signup',
  validateSchema(signupSchema),
  wrapAsync(signup)
);

// login route
userRouter.post(
  '/login',
  validateSchema(loginSchema),
  wrapAsync(login)
);

// get all users except logged-in user
userRouter.get('/', verifyToken, wrapAsync(allUsers));

export { userRouter };

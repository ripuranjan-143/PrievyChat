import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import {
  signup,
  login,
  allUsers,
  getUserById,
} from '../controllers/UserController.js';
import {
  signupSchema,
  loginSchema,
  getUserByIdSchema,
} from '../utils/Schema.js';
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

// get user details by ID
userRouter.get(
  '/:id',
  verifyToken,
  validateSchema(getUserByIdSchema),
  wrapAsync(getUserById)
);

export { userRouter };

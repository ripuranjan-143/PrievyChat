import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import {
  signup,
  login,
  allUsers,
  getUserById,
  deleteUserById,
} from '../controllers/UserController.js';
import {
  signupSchema,
  loginSchema,
  deleteUserByIdSchema,
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

// get user details
userRouter.get('/me', verifyToken, wrapAsync(getUserById));

// delete user by ID
userRouter.delete(
  '/:id',
  verifyToken,
  validateSchema(deleteUserByIdSchema),
  wrapAsync(deleteUserById)
);

export { userRouter };

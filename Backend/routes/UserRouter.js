import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import { signup, login } from '../controllers/UserController.js';
import { signupSchema, loginSchema } from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';

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

export { userRouter };

import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import { signup } from '../controllers/UserController.js';
import { signupSchema } from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';

const userRouter = express.Router();

// signup route
userRouter.post(
  '/signup',
  validateSchema(signupSchema),
  wrapAsync(signup)
);

export { userRouter };

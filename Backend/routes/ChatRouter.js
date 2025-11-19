import express from 'express';
import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import { oneToOneChatSchema } from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import { getOrCreateOneToOneChat } from '../controllers/ChatController.js';
const chatRouter = express.Router();

// create/access 1:1 chat
chatRouter.post(
  '/',
  verifyToken,
  validateSchema(oneToOneChatSchema),
  wrapAsync(getOrCreateOneToOneChat)
);

export { chatRouter };

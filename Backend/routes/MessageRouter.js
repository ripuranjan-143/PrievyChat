import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import {
  getChatMessagesSchema,
  createMessageSchema,
} from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import {
  getChatMessages,
  createMessage,
} from '../controllers/MessageController.js';

const messageRouter = express.Router();

// get all messages of a specific chat
messageRouter.get(
  '/chat/:chatId',
  verifyToken,
  validateSchema(getChatMessagesSchema),
  wrapAsync(getChatMessages)
);

// create a message
messageRouter.post(
  '/',
  verifyToken,
  validateSchema(createMessageSchema),
  wrapAsync(createMessage)
);

export { messageRouter };

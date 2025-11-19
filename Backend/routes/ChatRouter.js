import express from 'express';
import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import {
  oneToOneChatSchema,
  createGroupChatSchema,
} from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import {
  getOrCreateOneToOneChat,
  getUserChats,
  createNewGroupChat,
} from '../controllers/ChatController.js';
const chatRouter = express.Router();

// create/access 1:1 chat
chatRouter.post(
  '/',
  verifyToken,
  validateSchema(oneToOneChatSchema),
  wrapAsync(getOrCreateOneToOneChat)
);

// get all chats of the logged in user
chatRouter.get('/', verifyToken, wrapAsync(getUserChats));

// create a new group chat
chatRouter.post(
  '/group',
  verifyToken,
  validateSchema(createGroupChatSchema),
  wrapAsync(createNewGroupChat)
);

export { chatRouter };

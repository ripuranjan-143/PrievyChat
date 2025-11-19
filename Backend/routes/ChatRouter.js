import express from 'express';
import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import {
  oneToOneChatSchema,
  createGroupChatSchema,
  updateGroupChatSchema,
} from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import {
  getOrCreateOneToOneChat,
  getUserChats,
  createNewGroupChat,
  updateGroupChatName,
} from '../controllers/ChatController.js';
const chatRouter = express.Router();

// create/get one-to-one chat
chatRouter.post(
  '/one-to-one',
  verifyToken,
  validateSchema(oneToOneChatSchema),
  wrapAsync(getOrCreateOneToOneChat)
);

// get all user chats
chatRouter.get('/', verifyToken, wrapAsync(getUserChats));

// create a new group chat
chatRouter.post(
  '/group',
  verifyToken,
  validateSchema(createGroupChatSchema),
  wrapAsync(createNewGroupChat)
);

// rename a group chat
chatRouter.put(
  '/group/rename',
  verifyToken,
  validateSchema(updateGroupChatSchema),
  wrapAsync(updateGroupChatName)
);

export { chatRouter };

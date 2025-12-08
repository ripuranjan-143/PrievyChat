import express from 'express';
import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import {
  oneToOneChatSchema,
  createGroupChatSchema,
  updateGroupChatSchema,
  addUserToGroupSchema,
  removeUserFromGroupSchema,
} from '../utils/Schema.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import {
  getOrCreateOneToOneChat,
  getUserChats,
  createNewGroupChat,
  updateGroupChatName,
  addUserToGroupChat,
  removeUserFromGroupChat,
  updateGroupChatPicture,
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

// add a user to the group
chatRouter.put(
  '/group/add-user',
  verifyToken,
  validateSchema(addUserToGroupSchema),
  wrapAsync(addUserToGroupChat)
);

// remove a user from the group
chatRouter.put(
  '/group/remove-user',
  verifyToken,
  validateSchema(removeUserFromGroupSchema),
  wrapAsync(removeUserFromGroupChat)
);

// update group chat picture
chatRouter.put(
  '/group/update-picture',
  verifyToken,
  wrapAsync(updateGroupChatPicture)
);

export { chatRouter };

import express from 'express';

import { wrapAsync } from '../utils/WrapAsync.js';
import { verifyToken } from '../utils/AuthMiddleware.js';
import {
  getUserNotifications,
  markChatNotificationsAsRead,
} from '../controllers/NotificationController.js';
import { validateSchema } from '../utils/ValidateSchema.js';
import { markNotificationsAsReadSchema } from '../utils/Schema.js';

const notificationRouter = express.Router();

// get all unread notifications
notificationRouter.get(
  '/',
  verifyToken,
  wrapAsync(getUserNotifications)
);

// mark all notifications for a specific chat as read
notificationRouter.put(
  '/chat/:chatId/read',
  verifyToken,
  validateSchema(markNotificationsAsReadSchema),
  wrapAsync(markChatNotificationsAsRead)
);

export { notificationRouter };

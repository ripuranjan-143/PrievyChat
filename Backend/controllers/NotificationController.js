import { StatusCodes } from 'http-status-codes';

import { Notification } from '../models/NotificationModel.js';

// get all unread notifications for logged-in user
const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
  })
    .populate({
      path: 'message',
      populate: { path: 'sender', select: 'name email picture' },
    })
    .populate({
      path: 'chat',
      populate: {
        path: 'users groupAdmin',
        select: 'name email picture',
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(StatusCodes.OK).json(notifications);
};

// mark all notifications for a specific chat as read
const markChatNotificationsAsRead = async (req, res) => {
  const { chatId } = req.params;

  // delete notifications for this user & chat
  await Notification.deleteMany({
    recipient: req.user.id,
    chat: chatId,
  });

  res
    .status(StatusCodes.OK)
    .json({ message: 'Chat notifications marked as read' });
};

export { getUserNotifications, markChatNotificationsAsRead };

import { Chat } from '../models/ChatModel.js';
import { Message } from '../models/MessageModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { StatusCodes } from 'http-status-codes';

const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  // check chat is exist or not
  const chat = await Chat.findById(chatId).populate(
    'users',
    '-password'
  );
  if (!chat) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Chat not found');
  }

  // Check if requesting user is part of the chat
  if (
    !chat.users.map((u) => u._id.toString()).includes(req.user.id)
  ) {
    throw new ExpressError(
      StatusCodes.FORBIDDEN,
      'You are not a member of this chat'
    );
  }

  // Fetch messages for the chat
  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name email picture')
    .populate({
      path: 'chat',
      populate: {
        path: 'users groupAdmin',
        select: 'name email picture',
      },
    })
    .sort({ createdAt: 1 })
    .lean();
  res.status(StatusCodes.OK).json(messages);
};

export { getChatMessages };

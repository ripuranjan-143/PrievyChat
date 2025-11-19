import { Chat } from '../models/ChatModel.js';
import { User } from '../models/UserModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { StatusCodes } from 'http-status-codes';

const getOrCreateOneToOneChat = async (req, res) => {
  const { userId } = req.body;

  // Check if a 1-to-1 chat already exists, sorted by most recent
  let chat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .sort({ updatedAt: -1 }) // most recent chat first
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: 'name email picture',
      },
    });

  if (chat.length > 0) {
    return res.status(StatusCodes.OK).send(chat[0]);
  }

  // Ensure target user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Create a new 1-to-1 chat
  const newChat = await Chat.create({
    chatName: targetUser.name,
    isGroupChat: false,
    users: [req.user.id, userId],
  });

  // Populate the new chat with user details
  const fullChat = await Chat.findById(newChat._id).populate(
    'users',
    '-password'
  );

  res.status(StatusCodes.CREATED).send(fullChat);
};

export { getOrCreateOneToOneChat };

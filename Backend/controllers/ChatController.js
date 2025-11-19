import { Chat } from '../models/ChatModel.js';
import { User } from '../models/UserModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { StatusCodes } from 'http-status-codes';

const getOrCreateOneToOneChat = async (req, res) => {
  const { userId } = req.body;

  // Ensure target user exists
  const targetUser = await User.findById(userId).lean();
  if (!targetUser) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Try to find existing 1-to-1 chat
  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user.id, userId] },
  })
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: { path: 'sender', select: 'name email picture' },
    })
    .lean();

  if (chat) {
    return res.status(StatusCodes.OK).send(chat);
  }

  // Create new 1-to-1 chat
  const newChatData = {
    chatName: targetUser.name,
    isGroupChat: false,
    users: [req.user.id, userId],
  };

  const newChat = await Chat.create(newChatData);

  // Populate the newly created chat
  const fullChat = await Chat.findById(newChat._id)
    .populate('users', '-password')
    .populate({
      path: 'latestMessage',
      populate: { path: 'sender', select: 'name email picture' },
    })
    .lean();

  res.status(StatusCodes.CREATED).send(fullChat);
};

const getUserChats = async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user.id } },
  })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate({
      path: 'latestMessage',
      populate: { path: 'sender', select: 'name email picture' },
    })
    .sort({ updatedAt: -1 })
    .lean();

  res.status(StatusCodes.OK).send(chats);
};

const createNewGroupChat = async (req, res) => {
  const { users, name } = req.body;

  // users array comes from frontend (at least 2 users)
  const groupUsers = [...users, req.user.id]; // add logged-in user

  // Create the group chat
  const groupChat = await Chat.create({
    chatName: name,
    users: groupUsers,
    isGroupChat: true,
    groupAdmin: req.user.id,
  });

  // Populate users and group admin for response
  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .lean();

  res.status(StatusCodes.CREATED).json(fullGroupChat);
};

export { getOrCreateOneToOneChat, getUserChats, createNewGroupChat };

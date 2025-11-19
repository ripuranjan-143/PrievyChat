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
  const loggedInUserId = req.user.id;

  // users array comes from frontend
  let finalUsers = [...users];

  // add logged-in user if missing
  if (!finalUsers.includes(loggedInUserId)) {
    finalUsers.push(loggedInUserId);
  }

  // Ensure at least 3 total (admin + 2 members)
  if (finalUsers.length < 3) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      'A group must have at least 2 other members'
    );
  }

  // Validate all users exist
  const foundUsers = await User.find({
    _id: { $in: finalUsers },
  }).select('_id');

  if (foundUsers.length !== finalUsers.length) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      'One or more selected users do not exist'
    );
  }

  // Create the group chat
  const groupChat = await Chat.create({
    chatName: name.trim(),
    users: finalUsers,
    isGroupChat: true,
    groupAdmin: loggedInUserId,
  });

  // Populate before sending response
  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .lean();

  return res.status(StatusCodes.CREATED).json(fullGroupChat);
};

const updateGroupChatName = async (req, res) => {
  const { chatId, chatName } = req.body;

  // fetch chat with minimal fields
  const chat = await Chat.findById(chatId).select(
    'isGroupChat groupAdmin chatName'
  );

  if (!chat) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Chat not found');
  }

  // only rename group chats
  if (!chat.isGroupChat) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      'You can rename only group chats'
    );
  }

  // validate admin
  if (chat.groupAdmin.toString() !== req.user.id) {
    throw new ExpressError(
      StatusCodes.FORBIDDEN,
      'Only the group admin can rename the group'
    );
  }

  // check if new name is same as old one
  const newName = chatName.trim();
  if (chat.chatName === newName) {
    throw new ExpressError(
      StatusCodes.BAD_REQUEST,
      'New name must be different'
    );
  }

  //  update & populate
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newName },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  return res.status(StatusCodes.OK).json(updatedChat);
};

export {
  getOrCreateOneToOneChat,
  getUserChats,
  createNewGroupChat,
  updateGroupChatName,
};
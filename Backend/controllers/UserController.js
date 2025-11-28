import { StatusCodes } from 'http-status-codes';

import { User } from '../models/UserModel.js';
import { Chat } from '../models/ChatModel.js';
import { Message } from '../models/MessageModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import {
  hashPassword,
  genToken,
  comparePassword,
} from '../utils/AuthHelper.js';

const signup = async (req, res) => {
  const { name, email, password, picture } = req.body;

  // check if email already exists
  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });
  if (existingUser) {
    throw new ExpressError(
      StatusCodes.CONFLICT,
      'Email is already used, try different email!'
    );
  }

  const hashedPassword = await hashPassword(password);

  // create new user
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    picture,
  });

  const savedUser = await newUser.save();
  const token = genToken(savedUser._id);

  res.status(StatusCodes.CREATED).json({
    message: 'User created successfully!',
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ExpressError(
      StatusCodes.UNAUTHORIZED,
      'Invalid email or password!'
    );
  }

  // match password
  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    throw new ExpressError(
      StatusCodes.UNAUTHORIZED,
      'Invalid email or password!'
    );
  }

  const token = genToken(user._id);

  res.status(StatusCodes.OK).json({
    message: 'Login successfull!',
    token,
  });
};

const allUsers = async (req, res) => {
  // if a search query exists, build a mongodb or filter for name/email (case-insensitive)
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  // fetch all users , excluding the logged-in user
  const users = await User.find(keyword).find({
    _id: { $ne: req.user.id },
  });

  // remove password field from each user before sending the response
  const cleanUsers = users.map((user) => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  });

  return res.status(StatusCodes.OK).json(cleanUsers);
};

const getUserById = async (req, res) => {
  // find the user by id of authentication
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    message: 'User fetched successfully!',
  });
};

const deleteUserById = async (req, res) => {
  // only allow logged-in user to delete their own account
  if (req.user.id !== req.params.id) {
    throw new ExpressError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to access this user!'
    );
  }

  // find the user
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  // delete all messages sent by the user
  await Message.deleteMany({ sender: req.user.id });

  // remove user from all chats
  await Chat.updateMany(
    { users: req.user.id },
    { $pull: { users: req.user.id } }
  );

  // optionally delete chats with no users left
  await Chat.deleteMany({ users: { $size: 0 } });

  // delete the user
  await User.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({
    message:
      'User and all related chats/messages deleted successfully!',
  });
};

export { signup, login, allUsers, getUserById, deleteUserById };

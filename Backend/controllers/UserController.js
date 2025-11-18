import { StatusCodes } from 'http-status-codes';
import { User } from '../models/UserModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashPassword, genToken, comparePassword } from '../utils/AuthHelper.js';

// controller: create a new user account
const signup = async (req, res) => {
  const { name, email, password, picture } = req.body;

  // check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(
      StatusCodes.CONFLICT,
      'Email is already used, try different email'
    );
  }

  // hash password before saving
  const hashedPassword = await hashPassword(password);

  // create user object
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    picture,
  });

  // save user to database
  const savedUser = await newUser.save();

  // generate JWT token
  const token = genToken(savedUser._id);

  // remove password from output
  const userResponse = savedUser.toObject();
  delete userResponse.password;

  // send success response
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User created successfully',
    ...userResponse,
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
      'Invalid email or password'
    );
  }

  // match password
  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    throw new ExpressError(
      StatusCodes.UNAUTHORIZED,
      'Invalid email or password'
    );
  }

  // generate token
  const token = genToken(user._id);

  // prepare response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'User logged in successfully',
    ...userResponse,
    token,
  });
};

export { signup, login };

import { StatusCodes } from 'http-status-codes';
import { User } from '../models/UserModel.js';
import { ExpressError  } from '../utils/ExpressError.js';
import { hashPassword, genToken } from '../utils/AuthHelper.js';

// controller: create a new user account
const signup = async (req, res) => {
  const { name, email, password, picture } = req.body;

  // check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError (
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

export { signup };

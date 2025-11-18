import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Config from './Config.js';

// hash the password using bcrypt with generated salt
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// generate JWT authentication token
const genToken = (id) => {
  return jwt.sign({ id }, Config.secretKey, {
    expiresIn: '24h',
  });
};

export { hashPassword, genToken };

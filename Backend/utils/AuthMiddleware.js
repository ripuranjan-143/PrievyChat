import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { ExpressError } from './ExpressError.js';
import Config from './Config.js';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(
      new ExpressError(StatusCodes.UNAUTHORIZED, 'No token provided')
    );
  }
  const token = authHeader.split(' ')[1];
  try {
    const decode = jwt.verify(token, Config.secretKey);
    req.user = decode;
    next();
  } catch {
    return next(
      new ExpressError(
        StatusCodes.UNAUTHORIZED,
        'Invalid or expired token'
      )
    );
  }
};

export { verifyToken };

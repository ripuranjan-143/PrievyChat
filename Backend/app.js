import express from 'express';
import cors from 'cors';

import { StatusCodes } from 'http-status-codes';
import { ExpressError } from './utils/ExpressError.js';
import { mainRouter } from './routes/MainRouter.js';

const app = express();

// middleware to parse JSON request bodies
app.use(express.json({ limit: '100kb' }));

// enable CORS so frontend can communicate with backend
app.use(cors());

// routes
app.use('/api/v1', mainRouter);

// route not found handler
app.use((req, res, next) => {
  next(new ExpressError(StatusCodes.NOT_FOUND, 'Page Not Found'));
});

// global error handler
app.use((err, req, res, next) => {
  console.log('Error : ', err);
  let statusCode =
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong!';

  // In production, hide sensitive internal error details
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error. Please try again later.';
  }
  res.status(statusCode).json({ success: false, message });
});

export default app;

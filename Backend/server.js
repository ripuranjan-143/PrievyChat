import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';

import Config from './utils/Config.js';
import ExpressError from './utils/ExpressError.js';

const app = express();

// parse incoming JSON request bodies
app.use(express.json());

// allow frontend to communicate with backend
app.use(cors());

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

// start the server and connect mongodb
const start = async () => {
  try {
    await mongoose.connect(Config.mongoUri);
    console.log(`Connected to database...`);

    app.listen(Config.port, () => {
      console.log(`Server listening on port ${Config.port}...`);
    });
  } catch (error) {
    console.log(`Could not connect to database... ${error.message}`);
    process.exit(1);
  }
};

start();

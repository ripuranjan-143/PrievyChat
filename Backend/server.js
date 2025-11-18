import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Config from './utils/Config.js';

const app = express();

app.use(express.json());
app.use(cors());

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

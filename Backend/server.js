import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

import Config from './utils/Config.js';
import app from './app.js';
import { connectToSocket } from './socket/SocketManager.js';

// HTTP + Socket.IO Server
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

// Connect socket logic
connectToSocket(io);

// connect to MongoDB and start the server
const start = async () => {
  try {
    await mongoose.connect(Config.mongoUri);
    console.log(`Connected to database...`);

    server.listen(Config.port, () => {
      console.log(`Server listening on port ${Config.port}...`);
    });
  } catch (error) {
    console.log(`Could not connect to database... ${error.message}`);
    process.exit(1);
  }
};

start();

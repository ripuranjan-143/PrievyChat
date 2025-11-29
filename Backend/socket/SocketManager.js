const connectToSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    let userId = null;

    // Setup user room
    socket.on('setup', (userData) => {
      userId = userData._id;
      socket.join(userId);
      socket.emit('connected');
    });

    // Join chat room
    socket.on('join chat', (room) => socket.join(room));

    // New message
    socket.on('new message', (newMsg) => {
      const chat = newMsg.chat;
      if (!chat?.users) return;

      chat.users.forEach((user) => {
        if (user._id !== newMsg.sender._id) {
          socket.to(user._id).emit('message received', newMsg);
        }
      });
    });
  });
};

export { connectToSocket };

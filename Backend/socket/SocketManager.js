const connectToSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    let userId = null;

    // setup user room
    socket.on('setup', (userData) => {
      userId = userData._id;
      socket.join(userId);
      socket.emit('connected');
    });

    // join chat room
    socket.on('join chat', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // typing indicators
    socket.on('typing', (roomId) => socket.to(roomId).emit('typing'));
    socket.on('stop typing', (roomId) =>
      socket.to(roomId).emit('stop typing')
    );

    // new message
    socket.on('new message', (newMsg) => {
      const chat = newMsg.chat;
      if (!chat?._id) return;
      socket.to(chat._id).emit('message received', newMsg);
    });
  });
};

export { connectToSocket };

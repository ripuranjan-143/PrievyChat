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
    });

    // leave chat room
    socket.on('leave chat', (roomId) => {
      socket.leave(roomId);
    });

    // typing indicators
    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('typing', roomId);
    });
    socket.on('stop typing', (roomId) => {
      socket.to(roomId).emit('stop typing', roomId);
    });

    // listen for a new message
    socket.on('new message', (newMessage) => {
      const chat = newMessage.chat;

      if (!chat?.users) return;
      
      chat.users.forEach((user) => {
        // sender should NOT receive notification
        if (user._id.toString() === newMessage.sender._id.toString())
          return;
        // send message to each user's personal room
        socket
          .to(user._id.toString())
          .emit('message received', newMessage);
      });
    });
  });
};

export { connectToSocket };

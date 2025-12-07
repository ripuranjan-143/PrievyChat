const connectToSocket = (io) => {
  io.on('connection', (socket) => {
    let userId = null;

    // setup user's personal room
    socket.on('setup', (userData) => {
      if (!userData || !userData._id) {
        console.error('Invalid user data in setup');
        socket.emit('error', { message: 'Invalid user data' });
        return;
      }

      userId = userData._id;
      socket.join(userId);
      socket.emit('connected');
    });

    // join a chat room
    socket.on('join chat', (roomId) => {
      if (!roomId) {
        console.error('Invalid room ID in join chat');
        return;
      }

      socket.join(roomId);
    });

    // leave a chat room
    socket.on('leave chat', (roomId) => {
      if (!roomId) {
        console.error('Invalid room ID in leave chat');
        return;
      }

      socket.leave(roomId);
    });

    // typing indicator - user started typing
    socket.on('typing', (roomId) => {
      if (!roomId) {
        console.error('Invalid room ID in typing');
        return;
      }

      socket.to(roomId).emit('typing', roomId);
    });

    // typing indicator - user stopped typing
    socket.on('stop typing', (roomId) => {
      if (!roomId) {
        console.error('Invalid room ID in stop typing');
        return;
      }

      socket.to(roomId).emit('stop typing', roomId);
    });

    // handle new message
    socket.on('new message', (newMessage) => {
      const chat = newMessage?.chat;

      if (!chat || !chat.users) {
        console.error('Invalid chat data in new message');
        return;
      }

      // send message to all users except sender
      chat.users.forEach((user) => {
        // skip sender
        if (
          user._id.toString() === newMessage.sender._id.toString()
        ) {
          return;
        }

        // emit to user's personal room
        socket
          .to(user._id.toString())
          .emit('message received', newMessage);
      });
    });

    // handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(
        'Socket disconnected:',
        socket.id,
        'Reason:',
        reason
      );
    });

    // handle connection errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // handle server-level errors
  io.on('error', (error) => {
    console.error('Socket.IO server error:', error);
  });
};

export { connectToSocket };

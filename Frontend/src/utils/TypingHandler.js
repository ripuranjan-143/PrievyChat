const createTypingHandler = (
  socket,
  socketConnected,
  activeChatRef,
  typing,
  setTyping,
  typingTimeoutRef,
  setNewMessage
) => {
  return (e) => {
    const value = e.target.value;
    setNewMessage(value);

    const activeChat = activeChatRef.current;
    if (!socketConnected || !activeChat?._id) return;
    const roomId = activeChat._id;

    if (value.trim() === '') {
      socket.emit('stop typing', roomId);
      if (typingTimeoutRef.current)
        clearTimeout(typingTimeoutRef.current);
      setTyping(false);
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit('typing', roomId);
    }

    if (typingTimeoutRef.current)
      clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', roomId);
      setTyping(false);
    }, 2000);
  };
};

export default createTypingHandler;

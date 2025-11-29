// returns the opposite user (the one with chatting)
export const getSenderData = (currentUser, users) => {
  if (!currentUser || !users) {
    return { name: 'Unknown', user: null };
  }

  // find the user that is NOT the logged-in
  const otherUser = users.find(
    (user) => user._id !== currentUser._id
  );

  return {
    name: otherUser?.name || 'Unknown',
    user: otherUser || null,
  };
};

// handles LEFT margin for messages
export const getMessageMargin = (messages, m, i, userId) => {
  // Case 1: next message is from same sender AND this message is NOT mine
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  // Case 2: next message is different sender OR this is the last message
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  // Case 3: message belongs to logged-in user → align right (auto margin)
  else return 'auto';
};

// whether to show avatar beside a message
export const isMessageFromDifferentSender = (
  messages,
  m,
  i,
  userId
) => {
  return (
    i < messages.length - 1 &&
    // next message is from a different sender OR undefined
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    // and this message is not mine
    messages[i].sender._id !== userId
  );
};

// checks if the CURRENT message is the FINAL message
export const isFinalMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// returns TRUE if previous message is from same sender
export const isPreviousMessageSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

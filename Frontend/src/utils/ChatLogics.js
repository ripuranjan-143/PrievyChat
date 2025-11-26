export const getSenderData = (currentUser, users) => {
  if (!currentUser || !users) {
    return { name: 'Unknown', user: null };
  }

  const otherUser = users.find(
    (user) => user._id !== currentUser._id
  );

  return {
    name: otherUser?.name || 'Unknown',
    user: otherUser || null,
  };
};

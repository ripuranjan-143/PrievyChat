export const getSender = (currentUser, users) => {
  if (!currentUser || !users) return 'Unknown';
  return (
    users.find((user) => user._id !== currentUser._id)?.name ||
    'Unknown'
  );
};

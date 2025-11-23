// export const getSender = (currentUser, users) => {
//   console.log('currentUser=chatlogics', currentUser);
//   console.log('users=chatlogics', users);
//   return users[0]?._id === currentUser?._id
//     ? users[1].name
//     : users[0].name;
// };

export const getSender = (currentUser, users) => {
  if (!currentUser || !users) return 'Unknown';
  return (
    users.find((user) => user._id !== currentUser.userId)?.name ||
    'Unknown'
  );
};

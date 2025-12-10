import axiosInstance from '../config/axiosInstance.js';

export const fetchChatsService = async () => {
  const { data } = await axiosInstance.get('/chats');
  return data;
};

export const renameGroup = async (chatId, chatName) => {
  const { data } = await axiosInstance.put('/chats/group/rename', {
    chatId,
    chatName,
  });
  return data;
};

export const removeUserFromGroup = async (chatId, userId) => {
  const { data } = await axiosInstance.put('/chats/group/remove-user', {
    chatId,
    userId,
  });
  return data;
};

export const addUserToGroup = async (chatId, userId) => {
  const { data } = await axiosInstance.put('/chats/group/add-user', {
    chatId,
    userId,
  });
  return data;
};

export const createGroupChat = async (name, users, picture) => {
  const { data } = await axiosInstance.post('/chats/group', {
    name,
    users,
    picture,
  });
  return data;
};

export const updateGroupPicture = async (chatId, picture) => {
  const { data } = await axiosInstance.put('/chats/group/update-picture', {
    chatId,
    picture,
  });
  return data;
};
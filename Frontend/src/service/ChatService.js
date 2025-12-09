import axios from 'axios';
import server from '../config/api';
import formatApiError from '../utils/FormatApiError.js';

const fetchChatsService = async (token) => {
  try {
    const { data } = await axios.get(`${server}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const renameGroup = async (chatId, chatName, token) => {
  try {
    const { data } = await axios.put(
      `${server}/chats/group/rename`,
      { chatId, chatName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const removeUserFromGroup = async (chatId, userId, token) => {
  try {
    const { data } = await axios.put(
      `${server}/chats/group/remove-user`,
      { chatId, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const addUserToGroup = async (chatId, userId, token) => {
  try {
    const { data } = await axios.put(
      `${server}/chats/group/add-user`,
      { chatId, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const createGroupChat = async (name, users, token, picture) => {
  try {
    const { data } = await axios.post(
      `${server}/chats/group`,
      { name, users, picture },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const updateGroupPicture = async (chatId, picture, token) => {
  try {
    const { data } = await axios.put(
      `${server}/chats/group/update-picture`,
      { chatId, picture },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export {
  fetchChatsService,
  renameGroup,
  removeUserFromGroup,
  addUserToGroup,
  createGroupChat,
  updateGroupPicture,
};

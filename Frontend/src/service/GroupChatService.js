import axios from 'axios';
import server from '../config/api.js';
import formatApiError from '../utils/FormatApiError.js';

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

export { renameGroup, removeUserFromGroup, addUserToGroup };
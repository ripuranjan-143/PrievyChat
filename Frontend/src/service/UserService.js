import axios from 'axios';
import server from '../config/api';
import formatApiError from '../utils/FormatApiError.js';

const searchUsers = async (query, token) => {
  if (!query.trim()) return [];
  try {
    const { data } = await axios.get(
      `${server}/users?search=${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const accessChatWithUser = async (userId, token) => {
  try {
    const { data } = await axios.post(
      `${server}/chats/one-to-one`,
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

const updateUserProfileAPI = async (name, picture, token) => {
  try {
    const { data } = await axios.put(
      `${server}/users/me`,
      { name, picture },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export { searchUsers, accessChatWithUser, updateUserProfileAPI };

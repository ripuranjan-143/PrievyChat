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

export { fetchChatsService };

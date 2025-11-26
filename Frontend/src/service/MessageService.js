import axios from 'axios';
import server from '../config/api.js';
import formatApiError from '../utils/FormatApiError.js';

const fetchChatMessages = async (chatId, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.get(
      `${server}/messages/chat/${chatId}`,
      config
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export { fetchChatMessages };
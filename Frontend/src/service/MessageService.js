import axios from 'axios';
import server from '../config/api.js';
import formatApiError from '../utils/FormatApiError.js';

const fetchChatMessages = async (chatId, token) => {
  try {
    const { data } = await axios.get(
      `${server}/messages/chat/${chatId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

// Send a new message
const sendMessage = async (content, chatId, token) => {
  try {
    const { data } = await axios.post(
      `${server}/messages`,
      { content, chatId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export { fetchChatMessages, sendMessage };

import axios from 'axios';

import server from '../config/api.js';
import formatApiError from '../utils/FormatApiError.js';

// get all unread notifications
const fetchNotifications = async (token) => {
  try {
    const { data } = await axios.get(`${server}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

// mark unread notifications
const markChatNotificationsAsRead = async (chatId, token) => {
  try {
    const { data } = await axios.put(
      `${server}/notifications/chat/${chatId}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

export { fetchNotifications, markChatNotificationsAsRead };

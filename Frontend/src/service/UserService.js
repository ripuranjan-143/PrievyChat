import axios from 'axios';
import showToast from '../utils/ToastHelper';
import server from '../config/api';

const searchUsers = async (query, token) => {
  if (!query.trim()) {
    showToast('Please enter something to search', 'warning');
    return [];
  }
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${server}/users?search=${query}`,
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    showToast(error.message, 'error');
    return [];
  }
};

const accessChatWithUser = async (userId, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(
      `${server}/chats/one-to-one`,
      { userId },
      config
    );
    return data;
  } catch (error) {
    console.log(error);
    showToast(error.message, 'error');
    return null;
  }
};

export { searchUsers, accessChatWithUser };

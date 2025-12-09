import axios from 'axios';
import server from '../config/api';
import formatApiError from '../utils/FormatApiError.js';

// signup
const signupUser = async ({ name, email, password, picture }) => {
  try {
    const { data } = await axios.post(
      `${server}/users/signup`,
      { name, email, password, picture },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

// login
const loginUser = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${server}/users/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (error) {
    throw formatApiError(error);
  }
};

// upload profile picture to Cloudinary
const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ChatApk');
    formData.append('cloud_name', 'dwv10qvzj');
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dwv10qvzj/image/upload',
      formData
    );
    return res.data.secure_url;
  } catch (error) {
    throw formatApiError(error);
  }
};

// search user
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

// select chat
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

// update user profile
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

export {
  searchUsers,
  accessChatWithUser,
  updateUserProfileAPI,
  loginUser,
  signupUser,
  uploadProfileImage,
};

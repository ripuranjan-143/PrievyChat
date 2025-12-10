import axios from 'axios';
import axiosInstance from '../config/axiosInstance.js';

// Signup
export const signupUser = async ({ name, email, password, picture }) => {
  const { data } = await axiosInstance.post('/users/signup', {
    name,
    email,
    password,
    picture,
  });
  return data;
};

// Login
export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post('/users/login', {
    email,
    password,
  });
  return data;
};

// Upload profile picture to Cloudinary (external API - use regular axios)
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ChatApk');
  formData.append('cloud_name', 'dwv10qvzj');
  
  const res = await axios.post(
    'https://api.cloudinary.com/v1_1/dwv10qvzj/image/upload',
    formData
  );
  return res.data.secure_url;
};

// Search user
export const searchUsers = async (query) => {
  if (!query.trim()) return [];
  const { data } = await axiosInstance.get(`/users?search=${query}`);
  return data;
};

// Select/Access chat
export const accessChatWithUser = async (userId) => {
  const { data } = await axiosInstance.post('/chats/one-to-one', {
    userId,
  });
  return data;
};

// Update user profile
export const updateUserProfileAPI = async (name, picture) => {
  const { data } = await axiosInstance.put('/users/me', {
    name,
    picture,
  });
  return data;
};
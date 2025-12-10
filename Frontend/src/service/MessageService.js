import axiosInstance from '../config/axiosInstance.js';

export const fetchChatMessages = async (chatId) => {
  const { data } = await axiosInstance.get(`/messages/chat/${chatId}`);
  return data;
};

export const sendMessage = async (content, chatId) => {
  const { data } = await axiosInstance.post('/messages', {
    content,
    chatId,
  });
  return data;
};
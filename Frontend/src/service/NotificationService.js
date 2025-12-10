import axiosInstance from '../config/axiosInstance.js';

export const fetchNotifications = async () => {
  const { data } = await axiosInstance.get('/notifications');
  return data;
};

export const markChatNotificationsAsRead = async (chatId) => {
  const { data } = await axiosInstance.put(
    `/notifications/chat/${chatId}/read`
  );
  return data;
};
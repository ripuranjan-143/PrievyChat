import {
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchNotifications } from '../service/NotificationService.js';

export const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatStateProvider = ({ children }) => {
  // holds the currently opened chat window
  const [selectedChat, setSelectedChat] = useState(null);

  // stores all chats belonging to the user
  const [chats, setChats] = useState([]);

  // stores unread notifications from backend
  const [notification, setNotification] = useState([]);

  const { currentUser } = useAuth();

  // Fetch notifications from backend when user logs in
  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser?.token) {
        try {
          const notifications = await fetchNotifications();
          setNotification(notifications);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

  const value = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

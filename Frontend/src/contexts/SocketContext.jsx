import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../config/config.js';

const ENDPOINT = SOCKET_URL;

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // only connect if user is logged in
    if (!currentUser) {
      // disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setSocketConnected(false);
        setOnlineUsers([]);
      }
      return;
    }

    // create socket connection
    const newSocket = io(ENDPOINT, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // setup user's personal room
    newSocket.emit('setup', currentUser);

    // connection event handlers
    newSocket.on('connected', () => {
      setSocketConnected(true);
    });

    // receive initial list of online users
    newSocket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    // when a user comes online
    newSocket.on('user-online', (userId) => {
      setOnlineUsers((prev) => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    });

    // when a user goes offline
    newSocket.on('user-offline', (userId) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      setSocketConnected(false);
      console.error('Socket connection error:', error);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}...`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      // re-setup user when reconnected
      newSocket.emit('setup', currentUser);
      setSocketConnected(true);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Reconnection failed after all attempts');
      setSocketConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // cleanup on unmount or user change
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUser]);

  const value = {
    socket,
    socketConnected,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

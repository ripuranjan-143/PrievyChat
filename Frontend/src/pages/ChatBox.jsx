import { useState, useEffect, useRef } from 'react';

import { useChat } from '../contexts/ChatStateProvider';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { getSenderData } from '../utils/ChatLogics.js';
import {
  fetchChatMessages,
  sendMessage,
} from '../service/MessageService.js';
import { markChatNotificationsAsRead } from '../service/NotificationService.js';
import showToast from '../utils/ToastHelper.js';
import ChatHeader from '../components/ChatHeader.jsx';
import ChatMessages from '../components/ChatMessages.jsx';
import ChatInput from '../components/ChatInput.jsx';
import createTypingHandler from '../utils/TypingHandler.js';

function ChatBox({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const [groupchat, setGroupChat] = useState(false);
  const [singleChat, setSingleChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(null);

  const { selectedChat, setNotification } = useChat();
  const { currentUser } = useAuth();
  const { socket, socketConnected } = useSocket();

  const { name: otherName, user: otherUser } =
    selectedChat && !selectedChat.isGroupChat
      ? getSenderData(currentUser, selectedChat.users)
      : { name: '', user: null };

  // handle chat selection and room management
  useEffect(() => {
    // reset typing indicator when changing chats
    setIsTyping(false);

    // clear any pending typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // leave previous chat room and stop typing
    if (activeChatRef.current?._id && socket) {
      socket.emit('stop typing', activeChatRef.current._id);
      socket.emit('leave chat', activeChatRef.current._id);
    }

    // update active chat reference
    activeChatRef.current = selectedChat;

    // fetch messages for new chat
    if (selectedChat) {
      fetchMessages();
      markNotificationsRead(selectedChat._id);
    }
    setNewMessage('');
  }, [selectedChat, socket]);

  // setup socket event listeners
  useEffect(() => {
    if (!socket) return;

    // listen for incoming messages
    const handleMessageReceived = (newMsg) => {
      const activeChat = activeChatRef.current;

      // if message is NOT for current chat, add to notifications
      if (!activeChat || activeChat._id !== newMsg.chat._id) {
        setNotification((prev) => {
          const exists = prev.some(
            (n) => n.message?._id === newMsg._id
          );
          if (exists) return prev;

          return [
            {
              _id: `temp_${Date.now()}`,
              message: newMsg,
              chat: newMsg.chat,
              recipient: currentUser._id,
              isRead: false,
            },
            ...prev,
          ];
        });
        setFetchAgain((prev) => !prev);
      } else {
        // message is for current chat, add to messages
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    // listen for typing indicators
    const handleTyping = (roomId) => {
      const activeChat = activeChatRef.current;
      // only show typing if roomId matches current chat
      if (activeChat && activeChat._id === roomId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = (roomId) => {
      const activeChat = activeChatRef.current;
      // only hide typing if roomId matches current chat
      if (activeChat && activeChat._id === roomId) {
        setIsTyping(false);
      }
    };

    // register event listeners
    socket.on('message received', handleMessageReceived);
    socket.on('typing', handleTyping);
    socket.on('stop typing', handleStopTyping);

    // cleanup listeners on unmount
    return () => {
      socket.off('message received', handleMessageReceived);
      socket.off('typing', handleTyping);
      socket.off('stop typing', handleStopTyping);
    };
  }, [socket, currentUser, setNotification, setFetchAgain]);

  // cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // mark notifications as read for current chat
  const markNotificationsRead = async (chatId) => {
    try {
      await markChatNotificationsAsRead(chatId, currentUser.token);
      setNotification((prev) =>
        prev.filter((n) => n.chat?._id !== chatId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // fetch all messages for selected chat
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const data = await fetchChatMessages(
        selectedChat._id,
        currentUser.token
      );
      setMessages(data);

      // join new chat room
      if (socket) {
        socket.emit('join chat', selectedChat._id);
      }

      activeChatRef.current = selectedChat;
    } catch (error) {
      console.log(error);
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    // stop typing indicator
    if (socket) {
      socket.emit('stop typing', selectedChat._id);
    }

    try {
      const data = await sendMessage(
        newMessage.trim(),
        selectedChat._id,
        currentUser.token
      );

      // emit new message to other users
      if (socket) {
        socket.emit('new message', data);
      }

      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      setTyping(false);
    } catch (error) {
      console.error(error);
      showToast(error, 'error');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && newMessage.trim()) {
      handleSendMessage();
    }
  };

  // handle typing with debounce
  const typingHandler = createTypingHandler(
    socket,
    socketConnected,
    activeChatRef,
    typing,
    setTyping,
    typingTimeoutRef,
    setNewMessage
  );

  return (
    <div
      className="px-3 py-2 d-flex flex-column bg-white border"
      style={{
        width: '69vw',
        height: '90.9vh',
        borderWidth: '1px',
      }}
    >
      {selectedChat ? (
        <>
          <ChatHeader
            selectedChat={selectedChat}
            otherUser={otherUser}
            otherName={otherName}
            singleChat={singleChat}
            groupchat={groupchat}
            setSingleChat={setSingleChat}
            setGroupChat={setGroupChat}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
          />

          <ChatMessages
            loading={loading}
            messages={messages}
            isTyping={isTyping}
          />

          <ChatInput
            newMessage={newMessage}
            typingHandler={typingHandler}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center text-center h-100">
          <h4>Hi! Welcome to EchoMeet App.</h4>
          <p>Click on a user/group to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;

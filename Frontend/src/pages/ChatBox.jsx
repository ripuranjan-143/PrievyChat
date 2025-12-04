import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

import { useChat } from '../contexts/ChatStateProvider';
import { useAuth } from '../contexts/AuthContext';
import { getSenderData } from '../utils/ChatLogics.js';
import {
  fetchChatMessages,
  sendMessage,
} from '../service/MessageService.js';
import showToast from '../utils/ToastHelper.js';
import ChatHeader from '../components/ChatHeader.jsx';
import ChatMessages from '../components/ChatMessages.jsx';
import ChatInput from '../components/ChatInput.jsx';
import createTypingHandler from '../utils/TypingHandler.js';

const ENDPOINT = 'http://localhost:8080';
let socket;

function ChatBox({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const [groupchat, setGroupChat] = useState(false);
  const [singleChat, setSingleChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(null); // useRef for active chat

  const { selectedChat, notification, setNotification } = useChat();
  const { currentUser } = useAuth();

  const { name: otherName, user: otherUser } =
    selectedChat && !selectedChat.isGroupChat
      ? getSenderData(currentUser, selectedChat.users)
      : { name: '', user: null };

  useEffect(() => {
    activeChatRef.current = selectedChat; // update ref
    if (activeChatRef.current?._id && socket) {
      socket.emit('stop typing', activeChatRef.current._id);
      socket.emit('leave chat', activeChatRef.current._id);
    }
    fetchMessages();
  }, [selectedChat]);
  useEffect(() => {
    console.log('notification', notification);
  }, [notification]);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', currentUser);
    socket.on('connected', () => setSocketConnected(true));
    return () => socket.disconnect();
  }, [currentUser]);

  // listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const messageHandler = (newMsg) => {
      if (
        !activeChatRef.current ||
        activeChatRef.current._id !== newMsg.chat._id
      ) {
        setNotification((prev) => {
          const exists = prev.some((n) => n._id === newMsg._id);
          if (exists) return prev;
          return [newMsg, ...prev];
        });
        setFetchAgain((prev) => !prev);
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    const typingHandler = (roomId) => {
      if (
        activeChatRef.current &&
        activeChatRef.current._id === roomId
      )
        setIsTyping(true);
    };

    const stopTypingHandler = (roomId) => {
      if (
        activeChatRef.current &&
        activeChatRef.current._id === roomId
      )
        setIsTyping(false);
    };

    // register listeners
    socket.on('message received', messageHandler);
    socket.on('typing', typingHandler);
    socket.on('stop typing', stopTypingHandler);
    return () => {
      socket.off('message received', messageHandler);
      socket.off('typing', typingHandler);
      socket.off('stop typing', stopTypingHandler);
    };
  }, []);

  // get all messages
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      // leave the previous room
      if (activeChatRef.current?._id) {
        socket.emit('leave chat', activeChatRef.current._id);
      }
      const data = await fetchChatMessages(
        selectedChat._id,
        currentUser.token
      );
      setMessages(data);
      // join new room
      socket.emit('join chat', selectedChat._id);
      activeChatRef.current = selectedChat; // ← update ref
    } catch (error) {
      console.log(error);
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // send messages
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;
    socket.emit('stop typing', selectedChat._id);
    try {
      const data = await sendMessage(
        newMessage.trim(),
        selectedChat._id,
        currentUser.token
      );
      socket.emit('new message', data);
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && newMessage) handleSendMessage();
  };

  // typing handler
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
          {/* chat header */}
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

          {/*chat body*/}
          <ChatMessages
            loading={loading}
            messages={messages}
            isTyping={isTyping}
          />

          {/* input box */}
          <ChatInput
            newMessage={newMessage}
            typingHandler={typingHandler}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center text-center h-100">
          <h4>Hi! Welcome to PrievyChat App.</h4>
          <p>Click on a user/group to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;

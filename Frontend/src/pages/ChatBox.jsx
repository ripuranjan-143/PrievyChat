import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import io from 'socket.io-client';

import { useChat } from '../contexts/ChatStateProvider';
import { useAuth } from '../contexts/AuthContext';
import { getSenderData } from '../utils/ChatLogics.js';
import AvatarRow from '../components/AvatarRow.jsx';
import {
  fetchChatMessages,
  sendMessage,
} from '../service/MessageService.js';
import GroupChatSettingsModal from './GroupChatSettingsModal.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import ChatScrollView from './ChatScrollView.jsx';
import showToast from '../utils/ToastHelper.js';

const ENDPOINT = 'http://localhost:8080';
let socket, selectedChatCompare;

function ChatBox({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const [groupchat, setGroupChat] = useState(false);
  const [singleChat, setSingleChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const { selectedChat } = useChat();
  const { currentUser } = useAuth();

  const { name: otherName, user: otherUser } =
    selectedChat && !selectedChat.isGroupChat
      ? getSenderData(currentUser, selectedChat.users)
      : { name: '', user: null };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', currentUser);
    socket.on('connected', () => setSocketConnected(true));
    return () => socket.disconnect();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;
    const handler = (newMsg) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsg.chat._id
      ) {
        // give notification
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    };
    socket.on('message received', handler);
    return () => {
      if (socket?.off) socket.off('message received', handler);
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const data = await fetchChatMessages(
        selectedChat._id,
        currentUser.token
      );
      setMessages(data);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      console.log(error);
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;
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

  const typingHandler = (e) => {
    const value = e.target.value;
    setNewMessage(value);
  };

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
          {/* header */}
          <div className="d-flex align-items-center mb-1">
            {/* back arrow button */}
            <span style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </span>
            {/* avatar with name  */}
            {!selectedChat.isGroupChat ? (
              <>
                <div onClick={() => setSingleChat(true)}>
                  <AvatarRow
                    img={otherUser?.picture}
                    name={otherName}
                    className="ms-3"
                  />
                </div>
                {singleChat && (
                  <ProfileModal
                    show={singleChat}
                    setShow={setSingleChat}
                    user={otherUser}
                  />
                )}
              </>
            ) : (
              <>
                <div onClick={() => setGroupChat(true)}>
                  <AvatarRow
                    img={selectedChat?.picture}
                    name={selectedChat.chatName.toUpperCase()}
                    className="ms-3"
                  />
                </div>
                {groupchat && (
                  <GroupChatSettingsModal
                    groupChat={groupchat}
                    setGroupChat={setGroupChat}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                )}
              </>
            )}
          </div>
          {/* body */}
          <div
            className="d-flex flex-column justify-content-end pt-2 w-100 h-100 rounded-2 overflow-hidden"
            style={{ background: '#ecf3f2ff' }}
          >
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}
              >
                <FadeLoader
                  color="#38B2AC"
                  loading={true}
                  size={150}
                />
              </div>
            ) : (
              <div
                className="overflow-y-scroll"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitScrollbar: { display: 'none' },
                }}
              >
                <ChatScrollView messages={messages} />
              </div>
            )}

            <div>
              <div className="input-group">
                <input
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={handleKeyPress}
                  style={{ height: '50px' }}
                  type="text"
                  className="form-control mt-2 border-dark"
                  placeholder="Enter your message…"
                />
                <button
                  onClick={() => handleSendMessage()}
                  style={{
                    height: '50px',
                    backgroundColor: '#38B2AC',
                  }}
                  className="btn mt-2 border-dark hover-colour"
                  type="button"
                >
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
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

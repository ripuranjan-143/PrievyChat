import { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatStateProvider';
import { useAuth } from '../contexts/AuthContext';
import { getSenderData } from '../utils/ChatLogics.js';
import { FadeLoader } from 'react-spinners';
import AvatarRow from '../components/AvatarRow.jsx';
import { fetchChatMessages } from '../service/MessageService.js';
import GroupChatSettingsModal from './GroupChatSettingsModal.jsx';

function ChatBox({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const [groupchat, setGroupChat] = useState(false);
  const [message, setMessages] = useState([]);

  const { selectedChat } = useChat();
  const { currentUser } = useAuth();

  const { name: otherName, user: otherUser } =
    selectedChat && !selectedChat.isGroupChat
      ? getSenderData(currentUser, selectedChat.users)
      : { name: '', user: null };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const data = await fetchChatMessages(
        selectedChat._id,
        currentUser.token
      );
      setMessages(data);
    } catch (error) {
      console.log(error);
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

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
              <AvatarRow
                img={otherUser?.picture}
                name={otherName}
                className="ms-3"
              />
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
              ></div>
            )}

            <div>
              <div className="input-group">
                <input
                  style={{ height: '50px' }}
                  type="text"
                  className="form-control mt-2 border-dark"
                  placeholder="Enter your message…"
                />
                <button
                  style={{
                    height: '50px',
                    backgroundColor: '#38B2AC',
                  }}
                  className="btn mt-2 "
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

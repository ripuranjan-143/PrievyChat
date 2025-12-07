import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useChat } from '../contexts/ChatStateProvider.jsx';
import showToast from '../utils/ToastHelper.js';
import { getSenderData } from '../utils/ChatLogics.js';
import GroupChatModal from './GroupChatModal.jsx';
import { fetchChatsService } from '../service/ChatService.js';

const MyChats = ({ fetchAgain }) => {
  const [showGroupchat, setShowGroupchat] = useState(false);

  const { currentUser } = useAuth();
  const { chats, setChats, selectedChat, setSelectedChat } =
    useChat();

  const fetchChats = async () => {
    try {
      const data = await fetchChatsService(currentUser.token);
      setChats(data);
    } catch (error) {
      showToast(error, 'error');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentUser, fetchAgain]);

  return (
    <div style={{ width: '31vw' }} className=" p-2 border bg-white">
      <div
        className="px-2 d-flex justify-content-between"
        style={{ fontFamily: 'Work Sans', background: '#F8F8F8' }}
      >
        <p className="fs-2 ">My Chats</p>
        <button
          className="btn text-white mt-1 btn-hover-colour"
          style={{
            backgroundColor: '#38B2AC',
            height: '45px',
          }}
          onClick={() => setShowGroupchat(true)}
        >
          New Group Chat <i className="fa-solid fa-plus"></i>
        </button>
      </div>
      <div
        className="d-flex flex-column p-2"
        style={{
          background: '#F8F8F8',
          overflowY: 'hidden',
          height: '79.7vh',
        }}
      >
        {chats.length === 0 ? (
          // when array exists but is empty
          <div className="d-flex ps-2 fs-5 justify-content-center align-items-center h-100 w-100">
            <p>Search a user to start the chat</p>
          </div>
        ) : (
          // when chats exist
          <div
            style={{
              maxHeight: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="d-flex flex-column overflow-y-scroll"
          >
            {chats.map((chat) => {
              if (!chat || !chat.users) return null;

              // get sender data for private chat
              const { name: otherName, user: otherUser } =
                !chat.isGroupChat
                  ? getSenderData(currentUser, chat.users)
                  : { name: chat.chatName, user: null };

              // get profile picture
              const profilePic = chat.isGroupChat
                ? chat.picture ||
                  'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                : otherUser?.picture ||
                  'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className="rounded mb-2 px-3 py-2 d-flex align-items-center"
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedChat?._id === chat._id
                        ? '#38B2AC'
                        : '#E8E8E8',
                    color: selectedChat === chat ? 'white' : 'black',
                  }}
                >
                  <img
                    src={profilePic}
                    alt={otherName}
                    className="rounded-circle me-3"
                    style={{
                      width: '45px',
                      height: '45px',
                      objectFit: 'cover',
                    }}
                  />
                  <span className="fw-semibold">{otherName}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showGroupchat && (
        <GroupChatModal
          showGroup={showGroupchat}
          setShowGroup={setShowGroupchat}
        />
      )}
    </div>
  );
};

export default MyChats;

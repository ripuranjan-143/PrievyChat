import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useChat } from '../contexts/ChatStateProvider.jsx';
import showToast from '../utils/ToastHelper.js';
import server from '../config/api.js';
import { getSender } from '../utils/ChatLogics.js';
import GroupChatModal from './GroupChatModal.jsx';

const MyChats = ({ fetchAgain }) => {
  const [showGroupchat, setShowGroupchat] = useState(false);

  const { currentUser } = useAuth();
  const { chats, setChats, selectedChat, setSelectedChat } =
    useChat();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const { data } = await axios.get(`${server}/chats`, config);
      setChats(data);
    } catch (error) {
      console.log(error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch chats!';
      showToast(errMsg, 'error');
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentUser, fetchAgain]);

  return (
    <div style={{ width: '31vw' }} className=" p-2 border bg-white">
      <div
        className="px-2 d-flex justify-content-between"
        style={{ fontFamily: 'Work Sans',background: '#F8F8F8' }}
      >
        <p className='fs-2 '>My Chats</p>
        <button
          className="btn text-white mt-1 btn-hover-colour"
          style={{
            backgroundColor: '#38B2AC',
            height:'45px'
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
        {chats?.length > 0 ? (
          <div
            style={{
              maxHeight: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="d-flex flex-column overflow-y-scroll"
          >
            {chats?.map((chat) => {
              if (!chat || !chat.users) return null;

              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className="rounded mb-2 px-4 pt-3"
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                    color: selectedChat === chat ? 'white' : 'black',
                  }}
                >
                  <p>
                    {!chat.isGroupChat
                      ? getSender(currentUser, chat.users)
                      : chat.chatName}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="d-flex ps-2 fs-4 justify-content-center align-items-center h-100 w-100">
            <p>Loading...</p>
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

import { useState } from 'react';

import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileModal from './ProfileModal.jsx';
import UserSearchDrawer from './UserSearchDrawer.jsx';
import AvatarRow from './AvatarRow.jsx';
import { useChat } from '../contexts/ChatContext.jsx';
import { getSenderData } from '../utils/ChatHelper.js';
import { markChatNotificationsAsRead } from '../service/NotificationService.js';

function NavigationBar({ setFetchAgain }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { currentUser, handleLogout } = useAuth();
  const { setSelectedChat, notification, setNotification } =
    useChat();

  // group notification by chat
  const groupNotifications = (notifications) => {
    const map = {};

    notifications.forEach((n) => {
      const key = n.chat._id;

      if (!map[key]) {
        map[key] = {
          chat: n.chat,
          sender: n.sender,
          count: 1,
        };
      } else {
        map[key].count += 1;
      }
    });

    return Object.values(map);
  };

  // handle clicking on a notification
  const handleNotificationClick = async (notif) => {
    try {
      await markChatNotificationsAsRead(notif.chat._id);

      setNotification((prev) =>
        prev.filter((n) => n.chat?._id !== notif.chat._id)
      );

      setSelectedChat(notif.chat);
      setShowNotification(false);
    } catch (error) {
      console.error('Error handling notification click:', error);

      setNotification((prev) =>
        prev.filter((n) => n.chat?._id !== notif.chat._id)
      );
      setSelectedChat(notif.chat);
      setShowNotification(false);
    }
  };

  const grouped = groupNotifications(notification);

  return (
    <>
      {(showUserMenu || showNotification) && (
        <div
          onClick={() => {
            setShowUserMenu(false);
            setShowNotification(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 998,
          }}
        />
      )}

      <div className="d-flex justify-content-between px-4 py-2 bg-white">
        {/* left section */}
        <div
          onClick={() => setShowSearch(true)}
          className="d-flex align-items-center border border-dark rounded px-2 py-1 search-hover-colour"
          style={{
            maxWidth: '300px',
            minWidth: '180px',
            cursor: 'pointer',
            backgroundColor: '#eff2f4ff',
          }}
        >
          <i className="fa-solid fa-magnifying-glass me-2"></i>
          <span>Search or start a new chat</span>
        </div>

        {/* Header */}
        <div className="pt-1">
          <h3>EchoMeet</h3>
        </div>

        {/* right section */}
        <div className="d-flex align-items-center">
          {/* theme */}
          <div
            className="me-3 p-1 hover-colour"
            style={{ borderRadius: '10px', cursor: 'pointer' }}
          >
            <i className="fa-regular fa-sun"></i>
          </div>

          {/* notification bell */}
          <div className="position-relative me-3">
            <button
              className="btn p-1 position-relative hover-colour"
              onClick={() => setShowNotification(!showNotification)}
            >
              {notification.length > 0 && (
                <span
                  className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: '10px',
                    padding: '3px 5px',
                    marginTop: '5px',
                  }}
                >
                  {notification.length}
                </span>
              )}
              <i className="fa-solid fa-bell fs-6"></i>
            </button>

            {showNotification && (
              <div
                className="shadow-lg px-1 pb-1 bg-white mt-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45px',
                  borderRadius: '5px',
                  minWidth: '250px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 999,
                }}
              >
                {notification.length === 0 && (
                  <p className="text-center p-1 hover-colour mb-0 rounded">
                    No New Messages
                  </p>
                )}

                {/* render group notifications */}
                {grouped.map((g) => {
                  const { name } = getSenderData(
                    currentUser,
                    g.chat.users,
                    g.chat.isGroupChat,
                    g.chat.chatName
                  );

                  return (
                    <button
                      key={g.chat._id}
                      className="dropdown-item hover-colour btn-hover-colour px-2 py-1 rounded mt-1 d-flex justify-content-between align-items-center"
                      onClick={() => handleNotificationClick(g)}
                    >
                      <span>
                        {g.chat.isGroupChat
                          ? `New Message in ${name}`
                          : `New Message from ${name}`}
                      </span>

                      {/* count */}
                      <span
                        className="badge bg-danger"
                        style={{ fontSize: '11px' }}
                      >
                        {g.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* user dropdown */}
          <div className="position-relative">
            <div onClick={() => setShowUserMenu(!showUserMenu)}>
              <AvatarRow
                img={currentUser?.picture}
                name={currentUser?.name || 'Guest'}
              />
            </div>

            {showUserMenu && (
              <div
                className="shadow-lg p-2 bg-white mt-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45px',
                  borderRadius: '8px',
                  minWidth: '160px',
                  zIndex: 999,
                }}
              >
                <button
                  className="dropdown-item hover-colour btn-hover-colour px-2 py-1 rounded"
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserMenu(false);
                  }}
                >
                  <i className="fa-solid fa-user me-2"></i> My Profile
                </button>

                <button
                  className="dropdown-item hover-colour btn-hover-colour px-2 py-1 rounded"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-from-bracket me-2"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfile && (
        <ProfileModal show={showProfile} setShow={setShowProfile} />
      )}

      {showSearch && (
        <UserSearchDrawer
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          setFetchAgain={setFetchAgain}
        />
      )}
    </>
  );
}

export default NavigationBar;

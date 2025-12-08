import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useChat } from '../contexts/ChatStateProvider.jsx';
import { RotateLoader } from 'react-spinners';
import {
  searchUsers,
  accessChatWithUser,
} from '../service/UserService.js';
import showToast from '../utils/ToastHelper.js';

const UserSearchDrawer = ({
  showSearch,
  setShowSearch,
  setFetchAgain,
}) => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { currentUser } = useAuth();
  const { chats, setChats, setSelectedChat } = useChat();

  // reset search when drawer closes
  useEffect(() => {
    if (!showSearch) {
      setSearch('');
      setSearchResult([]);
    }
  }, [showSearch]);

  // search user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    setLoading(true);
    try {
      const users = await searchUsers(query, currentUser.token);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = useCallback(
    (() => {
      let timer;
      return (query) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          handleSearch(query);
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  // access chat when user clicks a search result
  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const chat = await accessChatWithUser(
        userId,
        currentUser.token
      );
      if (chat && !chats.find((c) => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }
      if (chat) {
        setSelectedChat(chat);
        setFetchAgain((prev) => !prev); // force MyChats to refresh
      }
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoadingChat(false);
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {showSearch && <div className="search-overlay"></div>}

      <div
        className={`search-panel p-3 h-100 ${
          showSearch ? 'open' : ''
        }`}
      >
        {loadingChat && (
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center spinner-overlay"
          >
            <RotateLoader
              color="#0d6efd"
              loading={true}
              size={15}
              margin={5}
            />
          </div>
        )}

        <div className="d-flex justify-content-between p-0 p-2">
          <h5>Search or start a new chat</h5>
          <button
            style={{ paddingTop: '15px' }}
            onClick={() => setShowSearch(false)}
            type="button"
            className="btn-close"
          ></button>
        </div>

        {/* Search input */}
        <div className="input-group mb-3 p-2 position-relative">
          <input
            type="text"
            className="form-control border-dark"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debounceSearch(e.target.value); // use debounce
            }}
            disabled={loadingChat}
          />
          <button
            style={{ backgroundColor: '#38B2AC' }}
            className="btn text-white btn-hover-colour border-dark"
            onClick={() => handleSearch(search)}
            disabled={loadingChat}
          >
            Go
          </button>
        </div>

        {/* Search results */}
        <div className="list-group px-2">
          {loading ? (
            <div className="d-flex align-items-center text-secondary px-2">
              <strong role="status">Loading...</strong>
              <div
                className="spinner-border ms-auto"
                aria-hidden="true"
              ></div>
            </div>
          ) : searchResult.length > 0 ? (
            searchResult.map((u) => (
              <div
                key={u._id}
                className="d-flex align-items-center border rounded p-2 mb-2 border-secondary search-list"
                onClick={() => accessChat(u._id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={
                    u.picture ||
                    'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                  }
                  alt={u.name}
                  className="rounded-circle me-3 object-fit-cover"
                  style={{ width: '40px', height: '40px' }}
                />
                <div>
                  <div className="fw-semibold">{u.name}</div>
                  <div className="small">{u.email}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted px-3">No users found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchDrawer;

import { useState } from 'react';
import showToast from '../utils/ToastHelper.js';
import { useChat } from '../contexts/ChatStateProvider.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  renameGroup,
  removeUserFromGroup,
  addUserToGroup,
} from '../service/GroupChatService.js';
import { searchUsers } from '../service/UserService.js';

function GroupChatSettingsModal({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  groupChat,
  setGroupChat,
}) {
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [search, setSearch] = useState('');

  const { currentUser } = useAuth();
  const { selectedChat, setSelectedChat, setChats } = useChat();

  const handleRename = async () => {
    if (!groupChatName) {
      showToast('Group name cannot be empty!', 'warn');
      return;
    }
    try {
      setRenameLoading(true);
      const data = await renameGroup(
        selectedChat._id,
        groupChatName,
        currentUser.token
      );
      setSelectedChat(data);
      setChats((prevChats) =>
        prevChats.map((c) => (c._id === data._id ? data : c))
      );
      setFetchAgain(!fetchAgain);
      showToast('Group name updated!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setRenameLoading(false);
      setGroupChatName('');
    }
  };
  const handleRemove = async (removeUser) => {
    if (
      selectedChat.groupAdmin._id !== currentUser._id &&
      removeUser._id !== currentUser._id
    ) {
      showToast('Only admins can remove users!', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await removeUserFromGroup(
        selectedChat._id,
        removeUser._id,
        currentUser.token
      );
      if (removeUser._id === currentUser._id) {
        setSelectedChat();
        showToast('You left the group!', 'info');
      } else {
        setSelectedChat(data);
        showToast('User removed successfully!', 'success');
      }
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleAddUser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      showToast('User already in group!', 'warn');
      return;
    }
    if (selectedChat.groupAdmin._id !== currentUser._id) {
      showToast('Only admins can add someone!', 'error');
      return;
    }
    try {
      setLoading(true);
      const data = await addUserToGroup(
        selectedChat._id,
        addUser._id,
        currentUser.token
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      showToast('User added successfully!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
      setGroupChatName('');
    }
  };
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      showToast('Please enter something to search', 'error');
      return;
    }
    setSearch(query);
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
  return (
    <>
      {groupChat && (
        <div
          className="position-fixed top-0 start-0 w-100  h-100 d-flex justify-content-center align-items-center z-3"
          style={{
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="bg-white rounded px-4 pt-3"
            style={{
              width: '470px',
            }}
          >
            {/* HEADER */}
            <div className="d-flex justify-content-between border-bottom pb-1">
              <h4 className="text-center">
                {selectedChat?.chatName}
              </h4>
              <button
                onClick={() => setGroupChat(false)}
                className="btn-close pt-3 "
              ></button>
            </div>
            <div className="d-flex">
              {/* USERS LIST */}
              <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
                {selectedChat?.users?.map((u) => (
                  <span
                    className="rounded-4 d-flex gap-1 align-items-center"
                    key={u._id}
                    style={{
                      padding: '6px 12px',
                      background: '#bde0fe',
                    }}
                  >
                    {u.name}
                    <button
                      onClick={() => handleRemove(u)}
                      style={{ fontSize: '0.7rem' }}
                      type="button"
                      className="btn-close"
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            {/* INPUTS */}
            <div className="d-flex gap-2 mb-3">
              <input
                className="form-control"
                placeholder="Rename Chat"
                value={groupChatName || ''}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                className="btn btn-success"
                disabled={renameLoading}
                onClick={handleRename}
              >
                {renameLoading ? 'Updating...' : 'Update'}
              </button>
            </div>

            <input
              value={search}
              className="form-control mb-3"
              placeholder="Add User to group"
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div
              className="list-group mb-3"
              style={{ fontSize: '1rem' }}
            >
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult?.slice(0, 3).map((u) => (
                  <button
                    key={u._id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleAddUser(u)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={u.picture}
                        alt={u.name}
                        className="rounded-circle me-3"
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                        }}
                      />

                      <div className="d-flex flex-column align-items-start">
                        <span className="fw-bold">{u.name}</span>
                        <small className="text-muted">
                          {u.email}
                        </small>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-danger mb-3"
                onClick={() => handleRemove(currentUser)}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupChatSettingsModal;

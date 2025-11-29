import { useState } from 'react';
import axios from 'axios';
import server from '../config/api.js';
import { useChat } from '../contexts/ChatStateProvider.jsx';
import showToast from '../utils/ToastHelper.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { searchUsers } from '../service/UserService.js';
import { createGroupChat } from '../service/GroupChatService.js';

function GroupChatModal({ showGroup, setShowGroup }) {
  // don't render if modal hidden
  if (!showGroup) return null;

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const { chats, setChats, setSelectedChat } = useChat();

  // search users from backend
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      showToast('Please enter something to search', 'error');
      return;
    }
    setSearch(query);
    try {
      setLoading(true);
      const users = await searchUsers(query, currentUser.token);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // remove user from selected users
  const handleDelete = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((u) => u._id !== delUser._id)
    );
  };

  // add user to group
  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      showToast('User already selected!', 'warn');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch('');
  };

  // create new group chat
  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      showToast('All fields are required!', 'warn');
      return;
    }
    try {
      const newChat = await createGroupChat(
        groupChatName.trim(),
        selectedUsers.map((u) => u._id),
        currentUser.token
      );
      // reset and close modal
      setChats([newChat, ...chats]);
      // redirect to this new chat
      setSelectedChat(newChat);
      setShowGroup(false);
      showToast('New Group Chat Created!', 'success');
      setGroupChatName('');
      setSelectedUsers([]);
      setSearch('');
      setSearchResult([]);
    } catch (error) {
      showToast(error, 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header position-relative border-black">
              <h4
                className="modal-title position-absolute start-50 translate-middle-x"
                style={{ fontFamily: 'Work Sans' }}
              >
                Create Group Chat
              </h4>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowGroup(false)}
              ></button>
            </div>

            {/* body */}
            <div className="modal-body">
              <div className="mb-3 mt-3">
                <input
                  className="form-control border-dark"
                  placeholder="Chat Name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>

              {/* input search users */}
              <div>
                <input
                  className="form-control border-dark"
                  placeholder="Add Users eg: ranjan, ripu"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* show selected users as badges */}
            <div className="d-flex flex-wrap gap-2 mb-3 mx-4">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="badge bg-info text-dark px-3 pt-2 pb-2 rounded-pill"
                >
                  {u.name}
                  <button
                    type="button"
                    className="btn-close pb-2 ps-2"
                    onClick={(e) => handleDelete(u)}
                  ></button>
                </span>
              ))}
            </div>

            {/* search user list */}
            <div className="list-group mx-3">
              {loading ? (
                <div className="d-flex ps-2 fs-5 justify-content-center align-items-center h-100 w-100">
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  {searchResult?.slice(0, 3).map((u) => (
                    <button
                      key={u._id}
                      className="border-dark list-group-item list-group-item-action"
                      onClick={() => handleGroup(u)}
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
                  ))}
                  {!loading &&
                    searchResult.length === 0 &&
                    search && (
                      <p className="text-center mt-2">
                        no users found
                      </p>
                    )}
                </>
              )}
            </div>

            {/* footer */}
            <div className="modal-footer border-0">
              <button
                style={{
                  backgroundColor: '#38B2AC',
                }}
                className="btn text-white w-100 btn-hover-colour"
                onClick={handleSubmit}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupChatModal;

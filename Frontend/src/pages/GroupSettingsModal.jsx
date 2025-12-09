import { useState } from 'react';

import showToast from '../utils/ToastHelper.js';
import { useChat } from '../contexts/ChatContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  renameGroup,
  removeUserFromGroup,
  addUserToGroup,
  updateGroupPicture,
} from '../service/ChatService.js';
import { searchUsers } from '../service/UserService.js';
import { uploadProfileImage } from '../service/UserService.js';
import useImagePicker from '../hooks/useImagePicker.js';

function GroupSettingsModal({
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
  const [pictureLoading, setPictureLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState('');

  const { currentUser } = useAuth();
  const { selectedChat, setSelectedChat, setChats } = useChat();

  const { handleImageChange } = useImagePicker(
    setSelectedPicture,
    setPreviewPicture
  );

  const isAdmin = selectedChat?.groupAdmin?._id === currentUser._id;

  // rename group chat name
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

  // remove user from group
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

  // add user to group
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
      setSearchResult([]);
      setSearch('');
    }
  };

  // search the user
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

  // select pic
  const handlePictureSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  // update picture
  const handlePictureUpload = async () => {
    if (!selectedPicture) {
      showToast('Please select a picture first!', 'warn');
      return;
    }

    try {
      setPictureLoading(true);
      const uploadedImageUrl = await uploadProfileImage(
        selectedPicture
      );
      const data = await updateGroupPicture(
        selectedChat._id,
        uploadedImageUrl,
        currentUser.token
      );
      setSelectedChat(data);
      setChats((prevChats) =>
        prevChats.map((c) => (c._id === data._id ? data : c))
      );
      setFetchAgain(!fetchAgain);
      setSelectedPicture(null);
      setPreviewPicture('');
      showToast('Group picture updated!', 'success');
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setPictureLoading(false);
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
              width: '570px',
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

            <div className="d-flex mt-3">
              {/* LEFT SIDE - GROUP PICTURE */}
              <div className="me-3">
                <div className="profile-pic-wrapper profile-pic-wrapper-ht position-relative m-2">
                  <img
                    src={
                      previewPicture ||
                      selectedChat?.picture ||
                      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    }
                    alt="Group"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {isAdmin && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureSelect}
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: 'pointer' }}
                        disabled={pictureLoading}
                        id="groupPictureInput"
                      />
                      <div className="overlay d-flex justify-content-center align-items-center">
                        <span className="text-white fs-2">+</span>
                      </div>
                    </>
                  )}
                </div>

                {isAdmin && (
                  <>
                    <small className="text-muted d-block text-center mb-2">
                      Click to select
                    </small>
                    {selectedPicture && (
                      <button
                        className={`btn btn-primary btn-sm w-100 mt-1  ${
                          selectedPicture ? 'mb-3' : ''
                        }`}
                        onClick={handlePictureUpload}
                        disabled={pictureLoading}
                      >
                        {pictureLoading ? (
                          <span>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Uploading...
                          </span>
                        ) : (
                          'Upload'
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* RIGHT SIDE - USERS LIST */}
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap gap-2 mb-3 mt-2">
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

export default GroupSettingsModal;

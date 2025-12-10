import { useState } from 'react';
import { useChat } from '../contexts/ChatContext.jsx';
import showToast from '../utils/ToastHelper.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { searchUsers } from '../service/UserService.js';
import { createGroupChat } from '../service/ChatService.js';
import { uploadProfileImage } from '../service/UserService.js';
import useImagePicker from '../hooks/useImagePicker.js';

function CreateGroupModal({ showGroup, setShowGroup }) {
  // don't render if modal hidden
  if (!showGroup) return null;

  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { currentUser } = useAuth();
  const { chats, setChats, setSelectedChat } = useChat();

  const { handleImageChange } = useImagePicker(
    setSelectedPicture,
    setPreviewPicture
  );

  // search user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const users = await searchUsers(query);
      setSearchResult(users);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

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
    setSearchResult([]);
  };

  // submit for creating a new group chat
  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      showToast('All fields are required!', 'warn');
      return;
    }

    try {
      setSubmitLoading(true);
      let groupPictureUrl = '';
      if (selectedPicture) {
        groupPictureUrl = await uploadProfileImage(selectedPicture);
      }
      const newChat = await createGroupChat(
        groupChatName.trim(),
        selectedUsers.map((u) => u._id),
        groupPictureUrl
      );
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
      setShowGroup(false);
      showToast('New Group Chat Created!', 'success');
      setGroupChatName('');
      setSelectedUsers([]);
      setSearch('');
      setSearchResult([]);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // select pic
  const handlePictureSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1">
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: '600px' }}
        >
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

            {/* LEFT + RIGHT LAYOUT */}
            <div className="d-flex px-3 mt-3">
              {/* LEFT SIDE - GROUP PICTURE */}
              <div className="me-4">
                <div
                  className="profile-pic-wrapper profile-pic-wrapper-ht position-relative m-2"
                  style={{ width: '60px', height: '120px' }}
                >
                  <img
                    src={
                      previewPicture || 'anonymous-avatar-icon-25.jpg'
                    }
                    alt="Group"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />

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
                </div>
                <small className="text-muted d-block text-center my-2">
                  Click to select
                </small>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex-grow-1 mt-2">
                <div className="modal-body">
                  <div className="mb-3 mt-1">
                    <input
                      value={groupChatName}
                      className="form-control border-dark"
                      placeholder="Chat Name"
                      onChange={(e) =>
                        setGroupChatName(e.target.value)
                      }
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
              </div>
            </div>

            {/* show selected users as badges */}
            <div
              className="d-flex flex-wrap gap-2 mb-5 me-2"
              style={{ marginLeft: '2rem' }}
            >
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

            {/* show results */}
            <div className="list-group mx-4">
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
                          src={
                            u.picture && u.picture.trim() !== ''
                              ? u.picture
                              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                          }
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

            <div className="modal-footer border-0 mx-2">
              <button
                style={{ backgroundColor: '#38B2AC' }}
                className="btn text-white w-100"
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? 'Creating...' : 'Create Chat'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGroupModal;

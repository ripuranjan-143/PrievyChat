import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import showToast from '../utils/ToastHelper';
import { uploadProfileImage } from '../service/UserService.js';
import { updateUserProfileAPI } from '../service/UserService.js';
import useImagePicker from '../hooks/useImagePicker.js';

const ProfileModal = ({ show, setShow, user }) => {
  const { currentUser, updateUserProfile } = useAuth();

  // use passed user OR fallback to current logged user
  const displayUser = user || currentUser;

  // check if this is the logged-in user's own profile
  const isOwnProfile = !user || user._id === currentUser._id;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayUser?.name || '');
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(displayUser?.picture || '');
  const [loading, setLoading] = useState(false);

  const { handleImageChange } = useImagePicker(
    setPicture,
    setPreview
  );

  if (!show) return null;

  // handle profile update
  const handleUpdate = async () => {
    if (!name.trim()) {
      showToast('Name cannot be empty!', 'error');
      return;
    }

    // check if input is same as before
    const isNameSame = name.trim() === (displayUser.name || '');
    const isPictureChanged = picture instanceof File;

    // if nothing changed, show message and return
    if (isNameSame && !isPictureChanged) {
      showToast('No changes made!', 'info');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = displayUser.picture;

      // upload image ONLY if new file selected
      if (isPictureChanged) {
        uploadedImageUrl = await uploadProfileImage(picture);
      }

      await updateUserProfileAPI(name.trim(), uploadedImageUrl);
      // update the user in context with new data
      updateUserProfile(name.trim(), uploadedImageUrl);
      showToast('Profile updated successfully!', 'success');

      // reset edit mode
      setIsEditing(false);
      setPicture(null);
      setName(name.trim());
      setPreview(uploadedImageUrl);
    } catch (error) {
      showToast(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setName(displayUser?.name || '');
    setPreview(displayUser?.picture || '');
    setPicture(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title text-center">
                {isEditing ? 'Edit Profile' : displayUser?.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShow(false);
                  handleCancel();
                }}
              ></button>
            </div>

            <div className="modal-body text-center">
              {isEditing ? (
                <>
                  {/* Edit Mode */}
                  <div className="d-flex justify-content-center">
                    <div className="profile-pic-wrapper profile-pic-wrapper-ht-user mt-4">
                      <img
                        src={preview || 'avatar.png'}
                        alt="User Avatar"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e.target.files[0])
                        }
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: 'pointer' }}
                      />

                      <div className="overlay">
                        <span className="text-white">+</span>
                      </div>
                    </div>
                  </div>

                  <small className="text-muted d-block text-center mb-2">
                    Click to select
                  </small>
                  <input
                    type="text"
                    className="form-control mb-3 border-dark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <input
                    value={displayUser?.email}
                    type="text"
                    disabled
                    className="form-control border-dark"
                  />
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className="position-relative mx-auto mb-3">
                    <img
                      src={
                        currentUser?.picture || displayUser?.picture
                      }
                      alt="avatar"
                      className="rounded-circle shadow mt-4"
                      style={{
                        width: '180px',
                        height: '180px',
                        objectFit: 'cover',
                        border: '5px solid #fff',
                      }}
                    />
                  </div>

                  <h4 className="fw-bold mb-1">
                    {currentUser?.name || displayUser?.name}
                  </h4>
                  <p className="text-muted">{displayUser?.email}</p>
                </>
              )}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-between align-items-center">
              {/* LEFT SIDE */}
              <div>
                {isOwnProfile && !isEditing && (
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="d-flex gap-2">
                {!isEditing && (
                  <button
                    className="btn px-4 text-white"
                    style={{ backgroundColor: '#38B2AC' }}
                    onClick={() => {
                      setShow(false);
                      handleCancel();
                    }}
                  >
                    Close
                  </button>
                )}

                {isEditing && (
                  <>
                    <button
                      className="btn btn-secondary px-4"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-success px-4"
                      onClick={handleUpdate}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;

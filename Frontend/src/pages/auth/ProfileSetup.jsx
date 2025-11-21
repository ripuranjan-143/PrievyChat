import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import server from '../../config/api.js';
import showToast from '../../utils/ToastHelper';

import './ProfileSetup.css';
function ProfileSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // useeffect for restoring the email and password
  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem('tempSignupData'));
    if (!temp) {
      return;
    }
    setEmail(temp.email);
    setPassword(temp.password);
  }, []);

  // upload image
  const handleImageChange = (pics) => {
    if (!pics || !['image/jpeg', 'image/png'].includes(pics.type)) {
      showToast('Only JPG and PNG allowed', 'error');
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append('file', pics);
    data.append('upload_preset', 'ChatApk');
    data.append('cloud_name', 'dwv10qvzj');
    fetch('https://api.cloudinary.com/v1_1/dwv10qvzj/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.secure_url) {
          setPicture(data.secure_url);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        showToast('Image upload failed', 'error');
        setLoading(false);
      });
  };

  // save the user details / signup
  const handleSave = async () => {
    if (!username.trim()) {
      showToast('Please enter a valid name', 'error');
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      const { data } = await axios.post(
        `${server}/users/signup`,
        { name: username, email, password, picture },
        config
      );
      showToast('Account created successfully!', 'success');
      localStorage.removeItem('tempSignupData');
      localStorage.setItem('token', data.token);

      // Clear state
      setEmail('');
      setPassword('');
      setUsername('');
      setPicture('');

      navigate('/chats');
    } catch (err) {
      console.error(err);
      showToast(err?.message || 'Signup failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    localStorage.removeItem('tempSignupData');
    window.history.back();
  };

  return (
    <div className="modal d-block profile" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="d-flex align-items-center mb-3 position-relative border-bottom border-black pb-3">
            {/* back button */}
            <button
              className="btn p-0 position-absolute pt-2"
              style={{ left: 0 }}
              onClick={handleBack}
            >
              <i className="fa-solid fa-arrow-left fs-4"></i>
            </button>

            {/* center title */}
            <h5 className="w-100 text-center m-0">
              Set Up Your Profile
            </h5>
          </div>

          <div className="d-flex">
            {/* profile image container */}
            <div className="profile-pic-wrapper position-relative m-2">
              <img
                src={picture || 'avatar.png'}
                alt="User Avatar"
                className="w-100 h-100"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files[0])}
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                style={{ cursor: 'pointer' }}
              />
              <div className="overlay d-flex justify-content-center align-items-center">
                <span className="text-white fs-2">+</span>
              </div>
            </div>

            {/* input Fields */}
            <div
              className="d-flex flex-column justify-content-center mt-3 ms-2"
              style={{ width: '300px' }}
            >
              <input
                value={email}
                type="text"
                disabled
                className="form-control mb-3 border-dark"
              />
              <input
                value={username}
                type="text"
                placeholder="Enter your name"
                className="form-control mb-3 border-dark"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* save the user button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary mt-4 ms-auto "
            style={{ width: '245px' }}
          >
            {loading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;

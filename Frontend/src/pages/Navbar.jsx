import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import UserSearchDrawer from './UserSearchDrawer.jsx';

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { currentUser, handleLogout } = useAuth();

  return (
    <>
      <div className="d-flex justify-content-between px-4 py-2 bg-white">
        {/* left section */}
        <div
          type="button"
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

        {/* header */}
        <div className="pt-1">
          <h3>EchoMeet</h3>
        </div>

        {/* right section */}
        <div className="d-flex align-items-center">
          <div
            className="me-3 p-1 hover-colour"
            style={{
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            {/* theme change */}
            <i className="fa-regular fa-sun "></i>
            {/* <i className="fa-solid fa-moon"></i> */}
          </div>
          <div
            className="dropdown me-3 hover-colour"
            style={{
              borderRadius: '10px',
            }}
          >
            <button
              className="btn position-relative p-0 p-1"
              type="button"
            >
              {/* Bell Icon */}
              <i className="fa-solid fa-bell fs-6"></i>
            </button>
          </div>

          {/* profile dropdown*/}
          <div className="dropdown">
            <button
              className="btn border-0 dropdown-toggle d-flex align-items-center hover-colour"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src={
                  currentUser?.picture ||
                  'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                }
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{
                  width: '40px',
                  height: '37px',
                  objectFit: 'cover',
                }}
              />
              <span className="fw-semibold text-dark">
                {currentUser?.name || 'Guest'}
              </span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm ">
              <li>
                <button
                  className="dropdown-item hover-colour btn-hover-colour"
                  onClick={() => setShowProfile(true)}
                >
                  <i className="fa-solid fa-user me-2"></i> My Profile
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item hover-colour btn-hover-colour"
                  onClick={handleLogout}
                >
                  <i className="fa-solid fa-right-from-bracket me-2"></i>{' '}
                  Logout
                </button>
              </li>
            </ul>
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
        />
      )}
    </>
  );
}

export default Navbar;

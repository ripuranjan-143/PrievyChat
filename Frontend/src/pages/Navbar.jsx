import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import UserSearchDrawer from './UserSearchDrawer.jsx';
import AvatarRow from '../components/AvatarRow.jsx';

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { currentUser, handleLogout } = useAuth();

  return (
    <>
      {/* invisible overlay (closes menu) */}
      {showUserMenu && (
        <div
          onClick={() => setShowUserMenu(false)}
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
          {/* theme toggle */}
          <div
            className="me-3 p-1 hover-colour"
            style={{ borderRadius: '10px', cursor: 'pointer' }}
          >
            <i className="fa-regular fa-sun"></i>
          </div>

          {/* bell icon */}
          <div
            className="me-3 hover-colour"
            style={{ borderRadius: '10px' }}
          >
            <button className="btn p-1">
              <i className="fa-solid fa-bell fs-6"></i>
            </button>
          </div>

          {/* custom user dropdown */}
          <div className="position-relative">
            <div onClick={() => setShowUserMenu(!showUserMenu)}>
              <AvatarRow
                img={currentUser?.picture}
                name={currentUser?.name || 'Guest'}
                className="px-2 py-1"
              />
            </div>

            {/* dropdown menu */}
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

      {/* profile modal */}
      {showProfile && (
        <ProfileModal show={showProfile} setShow={setShowProfile} />
      )}

      {/* search drawer */}
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

import { useState } from 'react';
import axios from 'axios';

import showToast from '../utils/ToastHelper.js';
import server from '../config/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileModal from '../components/ProfileModal.jsx';

function Navbar() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { currentUser, handleLogout } = useAuth();

  // search user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResult([]);
      showToast('Please enter something to search', 'warning');
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const { data } = await axios.get(
        `${server}/users?search=${query}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between px-4 py-2 bg-white">
        {/* left section */}
        <div
          className="d-flex align-items-center border border-dark rounded px-2 py-1 search-hover-colour"
          style={{
            maxWidth: '300px',
            minWidth: '180px',
            cursor: 'pointer',
            backgroundColor: '#eff2f4ff',
          }}
          data-bs-toggle="offcanvas"
          data-bs-target="#searchDrawer"
          aria-controls="searchDrawer"
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

      {/* search drawer */}
      <div
        className="offcanvas offcanvas-start p-3 h-100"
        tabIndex="-1"
        id="searchDrawer"
        aria-labelledby="searchDrawerLabel"
      >
        <div className="offcanvas-header p-0 p-2">
          <h5 className="offcanvas-title" id="searchDrawerLabel">
            Search or start a new chat
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body p-0 p-2">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control border-dark"
              placeholder="Search by name or email "
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button
              style={{
                backgroundColor: '#38B2AC',
              }}
              className="btn text-white btn-hover-colour border-dark"
              onClick={() => handleSearch(search)}
            >
              Go
            </button>
          </div>

          <div className="list-group">
            {loading ? (
              <div className="ps-2 fs-5">Loading...</div>
            ) : (
              <div>
                {searchResult.length > 0 ? (
                  searchResult.map((u) => (
                    <div
                      key={u._id}
                      className="d-flex align-items-center border rounded p-2 mb-2 border-secondary search-list"
                    >
                      <img
                        src={u.picture}
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
                  <p className="text-muted ps-2">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

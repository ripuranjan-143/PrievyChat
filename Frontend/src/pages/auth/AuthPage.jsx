import { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import './Auth.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="pt-3 d-flex flex-column align-items-center">
      <div className="auth-title text-center rounded border shadow-sm pt-2 bg-white mb-2">
        {/* header */}
        <h2 className="fw-bold">Welcome to Echomeet</h2>

        <span className="p-5 mb-5">
          Fill the details to get started
        </span>
      </div>

      {/* tab */}
      <div className="auth-tab bg-white rounded border shadow-sm p-4">
        <ul
          className="nav justify-content-around mb-3 rounded-pill bg-light border border-dark"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link rounded-pill auth-btn-padding ${
                activeTab === 'login'
                  ? 'active-tab fw-semibold '
                  : 'text-dark button-tab'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link rounded-pill auth-btn-padding ${
                activeTab === 'signup'
                  ? 'active-tab fw-semibold '
                  : 'text-dark button-tab'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </li>
        </ul>

        {/* Tab content */}
        <div className="tab-content text-dark">
          <div
            className={`tab-pane fade ${
              activeTab === 'login' ? 'show active' : ''
            }`}
          >
            <Login switchTab={setActiveTab} />
          </div>
          <div
            className={`tab-pane fade ${
              activeTab === 'signup' ? 'show active' : ''
            }`}
          >
            <Signup switchTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import showToast from '../../utils/ToastHelper.js';
import server from '../../config/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { authenticateUser } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // basic validation
    if (!email.trim() || !password.trim()) {
      showToast('All fields are required!', 'warn');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email address!', 'warn');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${server}/users/login`,
        { email: email.trim(), password: password.trim() },
        config
      );
      showToast('Login successful!', 'success');
      authenticateUser(data.token);
      navigate('/chats');
      setEmail('');
      setPassword('');
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Login failed!';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <form autoComplete="off" onSubmit={handleLogin} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-dark">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            autoComplete="off"
            type="email"
            className="form-control border-dark"
            id="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label text-dark">
            Password <span className="text-danger">*</span>
          </label>
          <div className="input-group mb-4">
            <input
              autoComplete="new-password"
              type={showPassword ? 'text' : 'password'}
              className="form-control border-dark"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={{ width: '68px' }}
              className="btn btn-outline-dark border-start-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          className="btn border text-white login-account bg-primary mb-4"
          disabled={loading}
        >
          {loading ? (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>

        <button
          type="button"
          className="btn border text-white login-account bg-danger mb-4 d-flex justify-content-center align-items-center"
          onClick={() => {
            setEmail('ripu@gmail.com');
            setPassword('rrrrrr');
          }}
        >
          Get Guest User Credentials
        </button>
      </form>
    </div>
  );
};
export default Login;

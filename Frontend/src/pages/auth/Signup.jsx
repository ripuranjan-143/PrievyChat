import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { showToast } from '../../utils/ToastHelper';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Define all validations
    const validations = [
      {
        condition:
          !email.trim() || !password.trim() || !confirmPassword,
        message: 'Please fill all required fields',
      },
      {
        condition: !email.includes('@'),
        message: 'Please enter a valid email address',
      },
      {
        condition: password !== confirmPassword,
        message: 'Passwords do not match',
      },
      {
        condition: password.length < 6,
        message: 'Password must be at least 6 characters',
      },
    ];

    // Run validations
    for (let v of validations) {
      if (v.condition) {
        showToast(v.message, 'error');
        return;
      }
    }
    // store user data temporarily
    const tempUser = {
      email: email.trim(),
      password: password.trim(),
    };

    localStorage.setItem('tempSignupData', JSON.stringify(tempUser));
    showToast('Proceeding to profile setup…', 'success');
    navigate('/profile-setup');

    // Clear form state
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="d-flex flex-column align-items-center text-white">
      <form autoComplete="off" noValidate onSubmit={handleSignup}>
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
          <label htmlFor="password" className="form-label  text-dark">
            Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
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

        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="form-label  text-dark"
          >
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-control border-dark"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              style={{ width: '68px' }}
              type="button"
              className="btn btn-outline-dark border-start-0"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn border text-white signup-account bg-primary mb-1 d-flex justify-content-center align-items-center"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;

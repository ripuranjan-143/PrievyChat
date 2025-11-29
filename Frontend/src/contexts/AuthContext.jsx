import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FadeLoader } from 'react-spinners';
import server from '../config/api.js';
import showToast from '../utils/ToastHelper.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // current logged-in userInfo
  const [currentUser, setCurrentUser] = useState(null);

  // displays loading screen while checking login state
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data with token
  const fetchUser = async (token) => {
    setUserLoading(true);
    try {
      const res = await axios.get(`${server}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser({ ...res.data, token });
    } catch (err) {
      console.error('Error fetching user data:', err);
      showToast('Session expired. Please login again.', 'error');
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } finally {
      setUserLoading(false);
    }
  };

  // run on mount to fetch user if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);
    else setUserLoading(false);
  }, []);

  // store token and fetch user immediately
  const authenticateUser = async (token) => {
    localStorage.setItem('token', token);
    await fetchUser(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  // memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      currentUser,
      userLoading,
      authenticateUser,
      handleLogout,
    }),
    [currentUser, userLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {userLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}
        >
          <FadeLoader color="#0d6efd" loading={true} size={150} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

const NotFound = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh', textAlign: 'center' }}
    >
      <h1 style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => navigate(currentUser ? '/chats' : '/')}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;

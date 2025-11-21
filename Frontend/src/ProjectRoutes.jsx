import { useRoutes, Navigate } from 'react-router-dom';

import AuthPage from '../src/pages/auth/AuthPage.jsx';
import ProfileSetup from '../src/pages/auth/ProfileSetup.jsx';
import ChatPage from '../src/pages/ChatPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import NotFound from './pages/NotFound.jsx';
import './index.css';

function ProjectRoutes() {
  const { currentUser } = useAuth();

  const routes = useRoutes([
    // landing page for unauthenticated users
    {
      path: '/',
      element: !currentUser ? (
        <AuthPage />
      ) : (
        <Navigate to="/chats" replace />
      ),
    },
    // profile setup page route
    {
      path: '/profile-setup',
      element: currentUser ? (
        <Navigate to="/chats" replace />
      ) : (
        <ProfileSetup />
      ),
    },
    // chat page route
    {
      path: '/chats',
      element: currentUser ? (
        <ChatPage />
      ) : (
        <Navigate to="/" replace />
      ),
    },
    // catch-all route for undefined paths
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return <div className="appContainer">{routes}</div>;
}

export default ProjectRoutes;

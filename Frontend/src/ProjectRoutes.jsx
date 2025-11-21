import { useRoutes } from 'react-router-dom';

import AuthPage from '../src/pages/auth/AuthPage.jsx';
import ProfileSetup from '../src/pages/auth/ProfileSetup.jsx';
import ChatPage from '../src/pages/ChatPage.jsx';
import './index.css';

function ProjectRoutes() {
  const routes = useRoutes([
    { path: '/', element: <AuthPage /> },
    { path: '/profile-setup', element: <ProfileSetup /> },
    { path: '/chats', element: <ChatPage /> },
  ]);
  return <div className="appContainer">{routes}</div>;
}

export default ProjectRoutes;

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import ProjectRoutes from './ProjectRoutes.jsx';
import GlobalToaster from './components/GlobalToaster.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ProjectRoutes />
      <GlobalToaster />
    </AuthProvider>
  </BrowserRouter>
);

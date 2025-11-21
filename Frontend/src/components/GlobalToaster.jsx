import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { memo } from 'react';

export const GlobalToaster = memo(() => (
  <ToastContainer
    position="bottom-left"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss={false}
    draggable
    pauseOnHover
    theme="dark"
  />
));

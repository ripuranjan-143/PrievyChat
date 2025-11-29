import { toast } from 'react-toastify';

let activeToastId = null;

const showToast = (message, type = 'info') => {
  if (activeToastId) {
    toast.dismiss(activeToastId);
    activeToastId = null;
  }

  switch (type) {
    case 'success':
      activeToastId = toast.success(message);
      break;
    case 'error':
      activeToastId = toast.error(message);
      break;
    case 'warn':
      activeToastId = toast.warn(message);
      break;
    case 'info':
    default:
      activeToastId = toast.info(message);
      break;
  }
};

export default showToast;

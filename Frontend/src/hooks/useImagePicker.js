import showToast from '../utils/ToastHelper';

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE = 1 * 1024 * 1024;

const useImagePicker = (setFile, setPreview) => {
  const handleImageChange = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Only JPG or PNG allowed!', 'error');
      return;
    }

    if (file.size > MAX_SIZE) {
      showToast('File size must be less than 1MB!', 'error');
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return { handleImageChange };
};

export default useImagePicker;

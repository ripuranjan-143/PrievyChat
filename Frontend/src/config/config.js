const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

const API_URL = `${BASE_URL}/api/v1`;
const SOCKET_URL = BASE_URL;

export { BASE_URL, API_URL, SOCKET_URL };

import axios from 'axios';

// Centralized Axios instance. All requests go through the Vite dev-server
// proxy (/api -> http://localhost:5000) so the frontend and backend share an
// origin in development. In production, set VITE_API_BASE_URL to the backend URL.

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Attach JWT to every request once auth context provides a token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface a clean error message and handle 401 globally.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and let the app redirect to login.
      localStorage.removeItem('eh_token');
      localStorage.removeItem('eh_user');
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  },
);

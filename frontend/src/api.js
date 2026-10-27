import axios from 'axios';

// In dev, Vite proxies /api to http://localhost:5000 (see vite.config.js)
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// expired or invalid token -> back to login
api.interceptors.response.use((r) => r, (e) => {
  if (e.response?.status === 401 && localStorage.getItem('token')) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(e);
});

export const errMsg = (e) => e.response?.data?.message || 'Something went wrong. Please try again.';
export default api;

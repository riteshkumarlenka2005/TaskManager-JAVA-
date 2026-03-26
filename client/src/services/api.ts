import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || '/api';

// Defensive check: If it looks like a domain but lacks a protocol, prepend https://
if (API_URL !== '/api' && !API_URL.startsWith('http') && !API_URL.startsWith('/')) {
  API_URL = `https://${API_URL}`;
}


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth redirect on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

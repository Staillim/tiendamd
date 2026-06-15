import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('marketplay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const ct = response.headers['content-type'] || '';
    if (typeof response.data === 'string' && (ct.includes('text/html') || response.data.trim().startsWith('<'))) {
      return Promise.reject(new Error('Invalid API response'));
    }
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && !Object.keys(response.data).length) {
      return Promise.reject(new Error('Invalid API response'));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('marketplay_token');
      if (window.location.pathname.startsWith('/admin-marketplay-2026')) {
        window.location.href = '/admin-marketplay-2026/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

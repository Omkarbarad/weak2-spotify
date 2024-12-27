import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api/auth' });

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Centralized error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert('Unauthorized access. Please log in again.');
      localStorage.removeItem('token');
    } else if (error.response?.data?.error) {
      alert(error.response.data.error);
    }
    return Promise.reject(error);
  }
);
// API Functions
export const signup = (data) => API.post('/signup', data);
export const signin = (data) => API.post('/signin', data);
export const getProfile = () => API.get('/profile'); // Example profile retrieval
export const resetPassword = (data) => API.post('/reset-password', data); // Example password reset

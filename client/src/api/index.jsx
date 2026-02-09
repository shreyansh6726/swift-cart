import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Hardcoded to force local connection
  // baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing user info from localStorage", error);
    }
  }
  return req;
});

export default API;
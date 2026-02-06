import axios from 'axios';

const API = axios.create({
  // Accesses the Render URL from your .env file
  baseURL: process.env.REACT_APP_BACKEND_URL, 
});

// Interceptor to attach JWT token to every outgoing request
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
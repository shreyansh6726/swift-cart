import axios from 'axios';
import { getAuthToken } from '../context/AuthContext';

const API = axios.create({
  baseURL: (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
});

API.interceptors.request.use((req) => {
  const token = getAuthToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
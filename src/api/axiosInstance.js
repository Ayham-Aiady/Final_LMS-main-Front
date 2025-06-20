// axios.js
import axios from 'axios';
// import env from 'dotenv';
const instance = axios.create({
  // baseURL: 'http://localhost:5000/api' ||import.meta.env.VITE_API_BASE_URL ,
  baseURL: '/api',

  withCredentials: true, // send cookies (accessToken, refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: intercept errors globally
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err?.response?.data?.error || err.message;
    console.error('Axios Error:', message);
    return Promise.reject(err);
  }
);

export default instance;

// authService.js
import axios from './axiosInstance.js';

const authService = {
  login: async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const { data } = await axios.post('/auth/register', { name, email, password });
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { data } = await axios.post('/auth/logout');
      return data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const { data } = await axios.get('/auth/me');
      return data.user;
    } catch (error) {
      console.error('getMe error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const { data } = await axios.post('/auth/refresh-token');
      return data.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },
};

export default authService;

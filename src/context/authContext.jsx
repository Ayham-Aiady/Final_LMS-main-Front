// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../api/authApi.js';
import { useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();


  const fetchUser = async () => {
  const skipAuthRoutes = ['/login', '/register'];
  if (skipAuthRoutes.includes(location.pathname)) {
    setLoading(false);
    return;
  }

  try {
    const user = await authService.getMe();
    setUser(user);
  } catch (err) {
    if (err.response?.status !== 401) {
      console.error('Unexpected auth error:', err);
    }
    setUser(null);
  } finally {
    setLoading(false);
  }
};



//   const fetchUser = async () => {
//     try {
//       const currentUser = await authService.getMe();
//       setUser(currentUser);
//     } catch (err) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // toast.success('Logged out successfully');
    // navigate('/login');

  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

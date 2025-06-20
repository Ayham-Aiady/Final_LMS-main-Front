// auth.js
import jwtDecode from 'jwt-decode';

// Decode the JWT safely from cookie
export const getUserFromToken = () => {
  const token = getAccessTokenFromCookie();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error('Token decode error:', err);
    return null;
  }
};

export const getAccessTokenFromCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Role-based access check
export const hasRole = (user, role) => {
  return user?.role === role;
};

export const isLoggedIn = () => {
  return !!getUserFromToken();
};

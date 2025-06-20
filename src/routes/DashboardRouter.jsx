// src/pages/DashboardRouter.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const DashboardRouter = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await getCurrentUser(); // get user from token
        const role = res.user.role;

        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'student') {
          navigate('/dashboard/student');
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;
  return null;
};

export default DashboardRouter;
s
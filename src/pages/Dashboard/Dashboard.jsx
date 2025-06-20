// Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (loading || !user?.role) return;

  switch (user.role) {
    case 'student':
      navigate('/dashboard/student');
      break;
    case 'instructor':
      navigate('/dashboard/instructor');
      break;
    case 'admin':
      navigate('/admin/dashboard');
      break;
    default:
      navigate('/');
  }
}, [user?.role, loading]);

console.log('Dashboard user:', user);
console.log('Loading:', loading);

  return <p className="text-center mt-5">Redirecting to your dashboard...</p>;
};

export default Dashboard;

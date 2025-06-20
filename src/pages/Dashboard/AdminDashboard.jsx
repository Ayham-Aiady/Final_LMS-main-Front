import React from 'react';
import { useAuth } from '../../context/authContext.jsx';
import AdminSidebar from '../Admin/AdminSidebar.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5">
      <h2>Welcome, {user?.name} 👑</h2>
      <p>You are logged in as an <strong>Admin</strong>.</p>
      <hr />

      <div className="row mt-4">
       
        <div className="col-md-8">
          <p>📊 User management and platform stats go here.</p>
          {/* You can include <DashboardSummary /> or charts here later */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/Admin/AdminSidebar.jsx';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-light border-end p-3 shadow-sm sidebar-transition ${
          isSidebarOpen ? 'd-block' : 'd-none d-md-block'
        }`}
        style={{ minWidth: isSidebarOpen ? '220px' : '0', minHeight: '100vh' }}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="btn btn-outline-secondary mb-3 d-md-none"
        >
          {isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="bg-light p-3 shadow-sm h-100">
      <h5 className="mb-4">🔧 Admin Panel</h5>
      <div className="d-flex flex-column gap-2">
        <Link to="/admin/dashboard" className="btn btn-outline-dark">
            🏠 Admin Dashboard
        </Link>

        <Link to="/admin/users" className="btn btn-outline-primary">
          Manage Users
        </Link>
        <Link to="/admin/summary" className="btn btn-outline-secondary">
          View Summary
        </Link>
        <Link to="/admin/course-popularity" className="btn btn-outline-info">
          View Course Popularity
        </Link>
        <Link to="/admin/moderation" className="btn btn-outline-warning">
          Moderate Courses
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;

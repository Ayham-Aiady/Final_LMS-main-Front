import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InstructorSidebar = () => {
  const location = useLocation();

  const navLinks = [
     { path: '/instructor', label: '🏠 Dashboard' },
    { path: '/instructor/create-course', label: '➕ Create Course' },
    { path: '/instructor/my-courses', label: '📚 My Courses' },
    { path: '/instructor/add-assignment', label: '📝 Add Assignment' },
    { path: '/instructor/grade-submissions', label: '🧪 Grade Submissions' },
    { path: '/instructor/student-analytics', label: '📊 Student Analytics' }
  ];

  return (
    <div className="list-group">
      {navLinks.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={`list-group-item list-group-item-action ${location.pathname === link.path ? 'active' : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default InstructorSidebar;


import InstructorSidebar from '../pages/Instructor/InstructorSidebar.jsx'; 
import React from 'react';
import { Outlet } from 'react-router-dom';

const InstructorLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <aside className="col-md-2 bg-light min-vh-100 py-4 border-end">
          <InstructorSidebar />
        </aside>
        <main className="col-md-9 p-4">
          <Outlet /> {/* 👈 This is what renders the nested route content */}
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;


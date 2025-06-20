import React from 'react';
import { useAuth } from '../../context/authContext.jsx';
import InstructorSidebar from '../Instructor/InstructorSidebar.jsx';

const InstructorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        {/* <div className="col-md-3 bg-light min-vh-100 p-3 border-end">
          <InstructorSidebar />
        </div> */}

        {/* Main dashboard content */}
        <div className="col-md-9 p-4">
          <h2 className="mb-3">Welcome back, <span className="text-primary">{user?.name}</span> 👋</h2>
          <p className="text-muted">You’re logged in as an <strong>Instructor</strong>. Here’s a quick overview of your teaching space:</p>
          <hr />

          {/* Stat Cards */}
          <div className="row mt-4">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-start border-primary border-4">
                <div className="card-body">
                  <h5 className="card-title">📚 Courses</h5>
                  <p className="card-text text-muted">Create and manage your published and draft courses.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-start border-success border-4">
                <div className="card-body">
                  <h5 className="card-title">📝 Assignments</h5>
                  <p className="card-text text-muted">Upload new assignments or manage student submissions.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-start border-warning border-4">
                <div className="card-body">
                  <h5 className="card-title">📊 Analytics</h5>
                  <p className="card-text text-muted">Get insights into student performance and engagement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tip or next steps */}
          <div className="alert alert-info mt-4">
            💡 Tip: Use the sidebar to quickly navigate to course creation, assignment grading, and more!
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

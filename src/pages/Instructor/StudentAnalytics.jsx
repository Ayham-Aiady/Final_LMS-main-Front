import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';

const StudentAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/analytics/student-performance')
      .then(res => setAnalytics(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-4">📊 Loading analytics...</div>;

  return (
    <div className="container mt-5">
      <h2>📈 Student Performance Analytics</h2>
      <p className="text-muted">Top 50 students ranked by course completion and assignment grade</p>

      <div className="table-responsive">
        <table className="table table-bordered table-striped mt-4">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Total Courses</th>
              <th>Completed Courses</th>
              <th>Completion Rate (%)</th>
              <th>Avg. Assignment Grade</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((row, idx) => (
              <tr key={row.student_id}>
                <td>{idx + 1}</td>
                <td>{row.name}</td>
                <td>{row.total_courses}</td>
                <td>{row.completed_courses}</td>
                <td>{row.course_completion_rate || 0}</td>
                <td>{row.avg_assignment_grade !== null ? row.avg_assignment_grade : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAnalytics;

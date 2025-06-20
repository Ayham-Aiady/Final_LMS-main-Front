import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard/summary');

        setSummary(res.data);
      } catch (err) {
        setError('Failed to load summary');
      }
    };

    fetchSummary();
  }, []);

  if (error) return <div>{error}</div>;
  if (!summary) return <div>Loading summary...</div>;

  return (
    <div className="row mt-4">
      <h3 className="mb-4">📊 Platform Summary</h3>

      <StatCard label="Total Courses" value={summary.totalCourses} color="primary" />
      <StatCard label="Pending Courses" value={summary.pendingCourses} color="warning" />
      <StatCard label="Published Courses" value={summary.publishedCourses} color="success" />
      <StatCard label="Total Users" value={summary.totalUsers} color="info" />
      <StatCard label="Total Enrollments" value={summary.totalEnrollments} color="dark" />
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="col-md-4 mb-3">
    <div className={`card text-white bg-${color}`}>
      <div className="card-body text-center">
        <h5 className="card-title">{label}</h5>
        <h2 className="card-text">{value}</h2>
      </div>
    </div>
  </div>
);

export default DashboardSummary;

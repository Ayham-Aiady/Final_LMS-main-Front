import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CoursePopularity = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPopularity = async () => {
      try {
        const res = await axios.get('/api/admin/reports/course-popularity');
        const raw = res.data.data;

        setData({
          raw, // Preserve raw data for course cards
          labels: raw.map((c) =>
             c.instructor ? `${c.title} - ${c.instructor}` : c.title),
          datasets: [
            {
              label: 'Enrollments',
              data: raw.map((c) => c.enrollment_count),
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderRadius: 4,
            },
          ],
        });
      } catch {
        setError('Failed to load chart data');
      }
    };

    fetchPopularity();
  }, []);

  if (error) return <div className="text-danger">{error}</div>;
  if (!data) return <div>Loading chart...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📈 Course Popularity</h3>
      <Bar data={{ labels: data.labels, datasets: data.datasets }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      
      <div className="row mt-5">
        {data.raw.map((course) => (
          <div className="col-md-4 mb-4" key={course.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text text-muted">
                  <strong>{course.enrollment_count}</strong> enrollment{course.enrollment_count !== 1 && 's'}
                </p>
                {course.instructor && (
                  <p className="card-text">
                    👨‍🏫 Instructor: <em>{course.instructor}</em>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePopularity;

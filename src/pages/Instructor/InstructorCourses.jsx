// pages/Instructor/InstructorCourses.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';
import { Link } from 'react-router-dom';

const InstructorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses/getall');
        const instructorCourses = res.data.filter(course => course.instructor_id === user.id);
        setCourses(instructorCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user.id]);

  if (loading) return <div className="container mt-5">⏳ Loading your courses...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🎓 My Created Courses</h2>
      {courses.length === 0 ? (
        <p>You haven’t created any courses yet.</p>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={course.thumbnail_url}
                  className="card-img-top"
                  alt="thumbnail"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-truncate">{course.description}</p>
                  <Link
                    to={`/instructor/edit-course/${course.id}`}
                    className="btn btn-outline-primary mt-auto"
                  >
                    ✏️ Edit Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;

import { useEffect, useState } from 'react';
import axios from 'axios';

const CourseModeration = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  const fetchPendingCourses = async () => {
    try {
      const res = await axios.get('/api/admin/courses/pending');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load pending courses.');
    }
  };

  const updateApproval = async (id, isApproved) => {
    try {
      await axios.patch(`/api/admin/courses/${id}/approval`, { isApproved });
      fetchPendingCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (id, isPublished) => {
    try {
      await axios.patch(`/api/admin/courses/${id}/publish`, { isPublished });
      fetchPendingCourses();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h3>🛠 Course Moderation</h3>
      {courses.length === 0 ? (
        <p>No pending courses found.</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-6 mb-4" key={course.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5>{course.title}</h5>
                  <p className="text-muted">{course.description}</p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateApproval(course.id, true)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateApproval(course.id, false)}
                    >
                      ❌ Reject
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => togglePublish(course.id, !course.is_published)}
                    >
                      {course.is_published ? '📤 Unpublish' : '🚀 Publish'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseModeration;

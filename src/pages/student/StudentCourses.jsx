import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const StudentCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/enrollments/user/${userId}/with-courses`);
        setCourses(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Enrolled Courses
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr'
          }
        }}
      >
        {courses.map(course => (
          <Paper
            key={course.course_id}
            elevation={3}
            sx={{ p: 2 }}
          >
            <Typography variant="h6">{course.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Instructor: {course.instructor_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress: {course.progress}%
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default StudentCourses;

// StudentCourses.jsx
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const mockCourses = [
  { id: 1, title: 'Introduction to React', instructor: 'Jane Doe' },
  { id: 2, title: 'Advanced JavaScript', instructor: 'John Smith' },
  { id: 3, title: 'UI/UX Design Basics', instructor: 'Emily Johnson' }
];

const StudentCourses = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>📚 My Enrolled Courses</Typography>
      <Grid container spacing={3}>
        {mockCourses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{course.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Instructor: {course.instructor}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentCourses;

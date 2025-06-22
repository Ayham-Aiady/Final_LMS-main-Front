import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const CourseDetails = ({ userId }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollStatus, setEnrollStatus] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/details/${courseId}`);
        setCourse(res.data);

        // Enrollment check
        const enrollmentRes = await axios.get(`/api/enrollments/user/${userId}`);
        const enrolledCourses = enrollmentRes.data.map(e => e.course_id);
        if (enrolledCourses.includes(parseInt(courseId))) {
          setEnrolled(true);
        }
      } catch (err) {
        console.error('Error loading course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, userId]);

  const handleEnroll = async () => {
    try {
      await axios.post('/api/enrollments/create', {
        user_id: userId,
        course_id: courseId
      });
      setEnrollStatus('success');
      setEnrolled(true);
    } catch (err) {
      console.error('Enroll failed:', err);
      setEnrollStatus('error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return <Alert severity="error">Course not found</Alert>;
  }

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Card sx={{ display: 'flex', flexDirection: ['column', 'row'], mb: 4 }}>
        {course.thumbnail_url && (
          <CardMedia
            component="img"
            image={course.thumbnail_url}
            alt={course.title}
            sx={{ width: 320, maxHeight: 220, objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Instructor: {course.instructor?.name || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
            {course.moduleCount} Module{course.moduleCount !== 1 ? 's' : ''} · {course.lessonCount} Lesson{course.lessonCount !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {course.description}
          </Typography>

          {enrolled ? (
            <Alert severity="success">You're already enrolled in this course.</Alert>
          ) : (
            <Button variant="contained" onClick={handleEnroll}>
              Enroll Now
            </Button>
          )}

          {enrollStatus === 'success' && (
            <Alert sx={{ mt: 2 }} severity="success">
              Enrollment successful!
            </Alert>
          )}
          {enrollStatus === 'error' && (
            <Alert sx={{ mt: 2 }} severity="error">
              Enrollment failed. Try again.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Module list */}
      {course.modules?.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Course Modules
          </Typography>
          <List>
            {course.modules.map(mod => (
              <React.Fragment key={mod.id}>
                <ListItem disableGutters>
                  <ListItemText
                    primary={mod.title}
                    secondary={`${mod.lesson_count} lesson${mod.lesson_count !== 1 ? 's' : ''}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CourseDetails;

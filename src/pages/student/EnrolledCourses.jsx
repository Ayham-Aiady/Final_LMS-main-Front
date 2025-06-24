import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  LinearProgress,
  Fade
} from '@mui/material';
import { getEnrolledCourses } from '../../api/studentApi';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  return diff === 0
    ? 'Enrolled today'
    : `Enrolled ${diff} day${diff !== 1 ? 's' : ''} ago`;
};

const EnrolledCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchCourses = async () => {
      try {
        const data = await getEnrolledCourses(userId);
        const sorted = [...data].sort((a, b) => b.progress - a.progress);
        setCourses(sorted);
      } catch (err) {
        console.error('Error loading enrolled courses:', err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  if (loading) return <Typography>Loading courses...</Typography>;
  if (error) return <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>;
  if (courses.length === 0)
    return (
      <Typography sx={{ mt: 2 }}>
        You haven't enrolled in any courses yet. Explore and join one!
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        🎓 My Enrolled Courses
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr'
          },
          gap: 3
        }}
      >
        {courses.map((course, idx) => (
          <Fade in timeout={500 + idx * 100} key={course.course_id || idx}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              {course.thumbnail_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={course.thumbnail_url}
                  alt={course.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description || 'No description available.'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(course.enrolled_at)}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={Number(course.progress) || 0}
                    color={course.progress >= 100 ? 'success' : 'primary'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Progress: {course.progress || 0}%
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Link
                  to={
                    course.last_viewed_lesson_id
                      ? `/student/courses/${course.course_id}/lessons/${course.last_viewed_lesson_id}`
                      : `/student/courses/${course.course_id}/view`
                  }
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Continue Course
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};

export default EnrolledCourses;

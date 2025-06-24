import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
  LinearProgress
} from '@mui/material';
import { School, AssignmentLate, MenuBook } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';

const SummaryCard = ({ icon, label, value, color }) => (
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 3,
      py: 2,
      flex: '1 0 auto',
      minWidth: 240,
      maxWidth: '100%',
      borderLeft: `6px solid ${color}`
    }}
  >
    <Box color={color}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '☀️ Good morning';
  if (hour < 18) return '🌤️ Good afternoon';
  return '🌙 Good evening';
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`/api/enrollments/dashboard-overview/${userId}`);
        setEnrolledCourses(res.data.courses || []);
        setCompletedLessons(res.data.completedLessons || 0);
        setPendingAssignments(res.data.pendingAssignments || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDashboardData();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const inProgressCourses = enrolledCourses
    .filter(c => typeof c.progress === 'number' && c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
    <Box sx={{ mt: 5, px: { xs: 2, md: 6 } }}>
      {/* Greeting */}
      <Box sx={{
        animation: 'fadeIn 0.8s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {getGreeting()}, {user?.name || user?.first_name || 'Student'}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Here's a quick overview to help you stay on track.
        </Typography>
      </Box>

      {/* Summary cards */}
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        sx={{ mt: 3 }}
      >
        <SummaryCard
          icon={<MenuBook fontSize="large" />}
          label="Enrolled Courses"
          value={enrolledCourses.length}
          color="#3f51b5"
        />
        <SummaryCard
          icon={<School fontSize="large" />}
          label="Completed Lessons"
          value={completedLessons}
          color="#43a047"
        />
        <SummaryCard
          icon={<AssignmentLate fontSize="large" />}
          label="Pending Assignments"
          value={pendingAssignments.length}
          color="#e53935"
        />
      </Stack>

      {/* Side-by-side dashboard panels */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{ mt: 5 }}
        useFlexGap
        flexWrap="wrap"
      >
        {/* Continue Courses */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            🚀 Continue Where You Left Off
          </Typography>
          {inProgressCourses.length === 0 ? (
            <Typography>No active courses in progress.</Typography>
          ) : (
            inProgressCourses.map((course) => (
              <Paper sx={{ p: 2, mb: 2 }} key={course.course_id}>
                <Stack direction="row" spacing={2}>
                  {course.thumbnail_url && (
                    <Box
                      component="img"
                      src={course.thumbnail_url}
                      alt={course.title}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  )}
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Progress: {Math.round(course.progress)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Link to={`/student/courses/${course.course_id}/view`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" size="small">Continue Course</Button>
                      </Link>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            ))
          )}
        </Box>

        {/* Upcoming Deadlines */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            📅 Upcoming Deadlines
          </Typography>
          {pendingAssignments.length === 0 ? (
            <Typography>No upcoming assignment deadlines.</Typography>
          ) : (
            <Paper sx={{ p: 2 }}>
              <Box component="ul" sx={{ pl: 2 }}>
                {pendingAssignments.map((a, i) => (
                  <li key={i}>
                    <Link to={`/student/assignments/${a.assignment_id}/view`}>
                      {a.assignment_title}
                    </Link>{' '}
                    — Due {new Date(a.deadline).toLocaleDateString()}
                  </li>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Stack>

      {/* Explore button */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Link to="/student/explore" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 8,
              textTransform: 'none',
              px: 4,
              py: 1.5
            }}
          >
            🔎 Browse More Courses
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default StudentDashboard;

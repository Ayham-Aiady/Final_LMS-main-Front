import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';

const ExploreCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 8;

  const loadCourses = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/courses/available/${userId}`, {
        params: { search, limit, offset: (page - 1) * limit }
      });

      const newCourses = res.data;

      if (page === 1) {
        setCourses(newCourses);
      } else {
        setCourses((prev) => [
          ...prev,
          ...newCourses.filter((c) => !prev.some((p) => p.id === c.id))
        ]);
      }

      if (newCourses.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCourses([]);
    setPage(1);
    setHasMore(true);
  };

  const handleScroll = (e) => {
    const nearBottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (nearBottom && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Box
      sx={{ padding: 4, height: '90vh', overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <Typography variant="h4" gutterBottom>
        Explore Courses
      </Typography>

      <TextField
        label="Search courses"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
            lg: '1fr 1fr 1fr 1fr'
          }
        }}
      >
        {courses.map((course) => {
          const handleEnroll = async () => {
            try {
              await axios.post('/api/enrollments/create', {
                user_id: userId,
                course_id: course.id
              });
              setCourses((prev) => prev.filter((c) => c.id !== course.id));
            } catch (err) {
              console.error('Enrollment failed:', err);
            }
          };

          return (
            <Card
              key={course.id}
              sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
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
                <Typography gutterBottom variant="h6">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {course.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Link to={`/student/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="outlined" color="primary">
                    View Details
                  </Button>
                </Link>
              </Box>
            </Card>
          );
        })}
      </Box>

      {loading && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && courses.length === 0 && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 5 }}>
          No courses found.
        </Typography>
      )}
    </Box>
  );
};

export default ExploreCourses;

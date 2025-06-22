import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';


const ExploreCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 8;

  const loadCourses = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/courses/available/${userId}`, {
        params: {
          search,
          limit,
          offset: (page - 1) * limit,
        },
      });

      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setCourses(prev => {
  const existingIds = new Set(prev.map(c => c.id));
  const newCourses = res.data.filter(c => !existingIds.has(c.id));
  return [...prev, ...newCourses];
});

        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, search, page, hasMore]);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    setCourses([]);
    setPage(1);
    setHasMore(true);
  };

  const handleScroll = (e) => {
    const nearBottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (nearBottom && !loading) {
      loadCourses();
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

      <Grid container spacing={3}>
        {courses.map(course => {
  const handleEnroll = async () => {
    try {
      const res = await axios.post('/api/enrollments/create', {
        user_id: userId,
        course_id: course.id
      });
      // Optional: Remove course from the list after enrolling
      setCourses(prev => prev.filter(c => c.id !== course.id));
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  return (
    <Grid xs={12} sm={6} md={4} lg={3} key={course.id}>
     
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
     
    </Grid>
  );
})
}
      </Grid>

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

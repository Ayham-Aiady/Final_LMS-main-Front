import { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { getEnrolledCourses } from '../../api/studentApi'; // adjust the import if needed

const EnrolledCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getEnrolledCourses(userId).then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <Typography>Loading courses...</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        🎓 My Enrolled Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button href={`/student/courses/${course.id}`} size="small">View Course</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EnrolledCourses;

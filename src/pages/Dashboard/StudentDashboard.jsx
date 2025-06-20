




import { Grid, Paper, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../../context/authContext.jsx';

const FeatureCard = ({ icon, title, description, color }) => (
  <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'flex-start', minHeight: '140px' }}>
    <Box sx={{ mr: 2, color, fontSize: 36 }}>{icon}</Box>
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
  </Paper>
);

const StudentFeatures = () => {
  const { user } = useAuth();
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>🎒 What You Can Do</Typography>
      <Grid container spacing={3} columns={12}>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={<SearchIcon fontSize="inherit" />}
            title="Browse Courses"
            description="Discover a wide range of courses tailored to your interests and goals."
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={<LibraryAddCheckIcon fontSize="inherit" />}
            title="Enroll Easily"
            description="Join any course with a single click and start learning immediately."
            color="#43a047"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={<MenuBookIcon fontSize="inherit" />}
            title="Access Content"
            description="View modules, lessons, materials, and resources anytime, anywhere."
            color="#fb8c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={<QuizIcon fontSize="inherit" />}
            title="Engage & Submit"
            description="Take quizzes and submit assignments directly through your dashboard."
            color="#8e24aa"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={<TrendingUpIcon fontSize="inherit" />}
            title="Track Progress"
            description="Monitor completion rates, grades, and feedback to stay on track."
            color="#00acc1"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentFeatures;

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(form.email, form.password);
      const role = res?.user?.role;
      if (role === 'instructor') navigate('/instructor');
      else if (role === 'student') navigate('/dashboard/student');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Login failed';
      setError(msg);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
  elevation={8}
  sx={{
    p: 5,
    borderRadius: 3,
    backgroundColor: '#fefefe',
    borderLeft: '6px solid #3f51b5',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    maxWidth: 500,
    mx: 'auto',
  }}
>

        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          gutterBottom
          color="primary"
        >
          Log In to Coursify
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={3}>
          Welcome back! Let’s get you learning again.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Log In
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          fullWidth
          color="error"
        >
          Sign in with Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don’t have an account?{' '}
          <RouterLink to="/register" style={{ color: theme.palette.primary.main }}>
            Register here
          </RouterLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  useTheme,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed';
      setError(msg);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/register?prompt=select_account`;
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
          Create Your Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={3}>
          Start your learning journey with Coursify!
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            inputProps={{ minLength: 6 }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            Register
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleRegister}
          fullWidth
          color="error"
        >
          Sign up with Google
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <RouterLink to="/login" style={{ color: theme.palette.primary.main }}>
            Log in here
          </RouterLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;

// Register.jsx
import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';




const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

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
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Register</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Create Account
        </button>
      </form>
      <div className="text-center mt-3">
  <button className="btn btn-outline-danger w-100" onClick={handleGoogleRegister}>
    <i className="bi bi-google me-2"></i> Sign up with Google
  </button>
</div>

      <div className="text-center mt-3">
  <span>Already have an account? </span>
  <Link to="/login">Log in here</Link>
</div>

    </div>
  );
};

export default Register;

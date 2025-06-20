import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { toast } from 'react-toastify';
import logo from '../assets/Coursify-logo.png'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#111827' }}>
      <Toolbar sx={{ justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Left: Brand name */}
        <Box sx={{ position: 'absolute', left: 16 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}
          >
            Coursify
          </Typography>
        </Box>

        {/* Center: Logo */}
        <Box sx={{ mx: 'auto' }}>
          <Link to="/">
            <img src={logo} alt="Coursify Logo" style={{ maxHeight: 44 }} />
          </Link>
        </Box>

        {/* Right: Menu toggle */}
        <Box sx={{ position: 'absolute', right: 16 }}>
          <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem disabled>Welcome, {user?.name || 'Guest'}</MenuItem>
            {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

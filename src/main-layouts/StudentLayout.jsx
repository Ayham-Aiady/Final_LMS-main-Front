import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
  { label: 'My Courses', icon: <SchoolIcon />, path: '/student/courses' },
  { label: 'Assignments', icon: <AssignmentIcon />, path: '/student/assignments' }
];

const StudentLayout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => setOpen(prev => !prev);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Drawer, offset below Navbar */}
     <Drawer
  variant="persistent"
  anchor="left"
  open={open}
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    position: 'fixed',
    top: '64px',
    height: 'calc(100% - 64px)',
    zIndex: theme => theme.zIndex.appBar - 2, // 👈 Sidebar goes below navbar & footer
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      top: '64px',
      height: 'calc(100% - 64px)',
      boxSizing: 'border-box',
      zIndex: theme => theme.zIndex.appBar - 2 // 👈 Also apply here
    }
  }}
>

        <Toolbar>
          <IconButton onClick={toggleDrawer}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
        <List>
          {navItems.map(item => (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Reopen button when sidebar is closed */}
      {!open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            top: '72px',
            left: '16px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            zIndex: 1201
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: open ? `${drawerWidth}px` : 0,
          mt: '64px'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default StudentLayout;

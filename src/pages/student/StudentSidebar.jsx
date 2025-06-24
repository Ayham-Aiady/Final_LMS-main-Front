import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const StudentSidebar = ({ open, onToggle }) => {
  return (
    <>
      <IconButton onClick={onToggle} sx={{ m: 2 }}>
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          <ListItem button component="a" href="/student/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component="a" href="/student/courses">
            <ListItemText primary="My Courses" />
          </ListItem>
          <ListItem button component="a" href="/student/assignments">
            <ListItemText primary="Assignments" />
          </ListItem>
          <ListItem button component="a" href="/student/profile">
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default StudentSidebar;

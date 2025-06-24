// src/pages/student/Assignments.jsx
import { useEffect, useState } from 'react';
import { Typography, CircularProgress, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/assignments/getall')
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>📚 All Assignments</Typography>
      <List>
        {assignments.map((a) => (
          <ListItem
            key={a.id}
            divider
            secondaryAction={
              <Button
                variant="outlined"
                component={Link}
                to={`/student/assignments/${a.id}/view`}
              >
                View
              </Button>
            }
          >
            <ListItemText
              primary={a.title}
              secondary={`Due: ${a.deadline || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Assignments;

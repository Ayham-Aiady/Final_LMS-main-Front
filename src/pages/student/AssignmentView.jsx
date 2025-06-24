import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import axios from 'axios';

const AssignmentView = ({ assignmentId, userId }) => {
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await axios.get(`/api/assignments/get/${assignmentId}`);
        setAssignment(res.data);
      } catch (err) {
        setError('Failed to load assignment.');
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(`/api/submissions/getall`);
        const match = res.data.find(
          (s) => s.assignment_id === assignmentId && s.user_id === userId
        );
        if (match) setSubmission(match);
      } catch {
        // No-op
      }
    };

    if (assignmentId) fetchSubmission();
  }, [assignmentId, userId]);

  const uploadToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/upload', formData);
    return res.data.attachment.secure_url;
  };

  const handleSubmit = async () => {
    if (!file || !assignment) return;
    try {
      setSubmitting(true);
      const fileUrl = await uploadToServer(file);
      await axios.post('/api/submissions/create', {
        assignment_id: assignment.id,
        user_id: userId,
        submission_url: fileUrl
      });
      setToast(true);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  if (!assignment) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>📄 {assignment.title}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{assignment.description}</Typography>
      {assignment.file_url && (
        <Button href={assignment.file_url} target="_blank" sx={{ mb: 2 }}>
          📥 Download Assignment File
        </Button>
      )}

      {submission ? (
        <Alert severity="success">
          ✅ Submitted: <a href={submission.submission_url} target="_blank" rel="noreferrer">View File</a><br />
          {submission.grade && <>📊 Grade: {submission.grade} <br /></>}
          {submission.feedback && <>📝 Feedback: {submission.feedback}</>}
        </Alert>
      ) : (
        <Box sx={{ mt: 2 }}>
          <TextField
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={!file || submitting}
          >
            Submit Assignment
          </Button>
        </Box>
      )}

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        message="🎉 Assignment submitted!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default AssignmentView;

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  Paper,
  Snackbar
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import QuizView from './QuizView.jsx';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  // Fetch enrollment ID
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(`/api/enrollments/course/${courseId}`);
        setEnrollmentId(res.data.id);
      } catch {
        setError('Enrollment not found.');
      }
    };
    fetchEnrollment();
  }, [courseId]);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/api/lessons/get/${lessonId}`);
        setLesson(res.data);
      } catch {
        setError('Could not load lesson.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  // Fetch markdown content if it's a text lesson
  useEffect(() => {
    const fetchMarkdown = async () => {
      if (lesson?.content_type === 'text') {
        try {
          const attachmentRes = await axios.get(`/api/upload/lesson/${lesson.id}`);
          const fileRes = await axios.get(attachmentRes.data.url);
          setMarkdown(fileRes.data);
        } catch {
          setMarkdown('⚠️ Could not load text lesson.');
        }
      }
    };
    fetchMarkdown();
  }, [lesson]);

  // Fetch next lesson in course
  useEffect(() => {
    const fetchNextLesson = async () => {
      try {
        const modRes = await axios.get(`/api/modules/course/${courseId}`);
        const modules = modRes.data.sort((a, b) => a.order - b.order);
        for (const mod of modules) {
          const res = await axios.get(`/api/lessons/bymodule/${mod.id}`);
          const lessons = res.data.sort((a, b) => a.order - b.order);
          const next = lessons.find((l) => String(l.id) > String(lessonId));
          if (next) {
            setNextLesson(next);
            break;
          }
        }
      } catch {}
    };
    fetchNextLesson();
  }, [courseId, lessonId]);

  // Update last viewed lesson
  useEffect(() => {
    if (enrollmentId && lessonId) {
      axios.post('/api/enrollments/last-viewed', {
        enrollmentId,
        lessonId
      }).catch((err) => {
        console.error('Failed to update last viewed lesson:', err);
      });
    }
  }, [enrollmentId, lessonId]);

  // Mark lesson as completed
  const handleComplete = async () => {
    if (!enrollmentId || completed || submitting) return;
    try {
      setSubmitting(true);
      await axios.post('/api/progress/complete', { enrollmentId, lessonId });
      setCompleted(true);
      setShowToast(true);
      if (nextLesson) {
        setTimeout(() => {
          navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`);
        }, 2000);
      }
    } catch {
      setError('Failed to mark lesson as complete.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-complete for PDF (when scrolled to bottom)
  useEffect(() => {
    const handleScroll = () => {
      const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
      if (lesson?.content_type === 'pdf' && atBottom && !completed) {
        handleComplete();
      }
    };
    if (lesson?.content_type === 'pdf') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lesson, completed]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!lesson) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to={`/student/courses/${courseId}/view`} underline="hover">
          Back to Course
        </MuiLink>
        <Typography>{lesson.title}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>{lesson.title}</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        {lesson.content_type === 'video' ? (
          <ReactPlayer
            url={lesson.content_url}
            controls
            width="100%"
            onEnded={handleComplete}
          />
        ) : lesson.content_type === 'pdf' ? (
          <iframe
            src={lesson.content_url}
            width="100%"
            height="600px"
            title={lesson.title}
            style={{ border: 'none' }}
          />
        ) : lesson.content_type === 'text' ? (
          <Box sx={{ px: 1, py: 1, '& h1,h2': { mt: 2 }, '& ul': { pl: 3 }, '& code': { backgroundColor: '#f4f4f4', px: 0.5 } }}>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </Box>
        ) : lesson.content_type === 'quiz' ? (
          <QuizView lessonId={lesson.id} />
        ) : (
          <Typography>Unsupported content type: {lesson.content_type}</Typography>
        )}
      </Paper>

      <Button
        variant="contained"
        color={completed ? 'success' : 'primary'}
        disabled={completed || submitting}
        onClick={handleComplete}
      >
        {completed ? '✅ Completed' : 'Mark as Completed'}
      </Button>

      {completed && nextLesson && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
          <Link to={`/student/courses/${courseId}/lessons/${nextLesson.id}`}>
            <Button variant="contained" color="secondary">⏭️ Next Lesson</Button>
          </Link>
        </Box>
      )}

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message="🎉 Lesson marked as complete!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default LessonView;

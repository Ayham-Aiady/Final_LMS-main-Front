import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Skeleton,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CourseView = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [lastViewedLessonId, setLastViewedLessonId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load modules and lessons
  useEffect(() => {
    const fetchModulesAndLessons = async () => {
      try {
        const modRes = await axios.get(`/api/modules/course/${courseId}`);
        const sortedModules = modRes.data.sort((a, b) => a.order - b.order);
        setModules(sortedModules);

        const lessonMap = {};
        await Promise.all(
          sortedModules.map(async (mod) => {
            const res = await axios.get(`/api/lessons/bymodule/${mod.id}`);
            lessonMap[mod.id] = res.data.sort((a, b) => a.order - b.order);
          })
        );
        setLessonsByModule(lessonMap);
      } catch (err) {
        console.error('Error loading course content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndLessons();
  }, [courseId]);

  // Fetch completed and last viewed lesson IDs
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const enrollmentRes = await axios.get(`/api/enrollments/course/${courseId}`);
        const enrollmentId = enrollmentRes.data.id;
        setLastViewedLessonId(enrollmentRes.data.last_viewed_lesson_id || null);

        const completedRes = await axios.get(`/api/progress/${enrollmentId}/completed-lessons`);
        setCompletedLessonIds(completedRes.data); // array of lesson IDs
      } catch (err) {
        console.error('Error fetching progress data:', err);
      }
    };

    fetchProgressData();
  }, [courseId]);

  // Find next incomplete lesson
  const findNextLesson = () => {
    for (const mod of modules) {
      const lessons = lessonsByModule[mod.id] || [];
      const next = lessons.find((l) => !completedLessonIds.includes(l.id));
      if (next) return next;
    }
    return null;
  };

  if (loading)
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Box>
    );

  const nextLesson = findNextLesson();

  return (
    <Box sx={{ mt: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/student/dashboard" underline="hover">
          Dashboard
        </MuiLink>
        <MuiLink component={Link} to="/student/courses" underline="hover">
          My Courses
        </MuiLink>
        <Typography color="text.primary">Course Content</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        📘 Course Content
      </Typography>

      {nextLesson && (
        <Box sx={{ mb: 3 }}>
          <Link to={`/student/courses/${courseId}/lessons/${nextLesson.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              🚀 Resume Course
            </Button>
          </Link>
        </Box>
      )}

      {modules.map((module) => (
        <Accordion key={module.id} sx={{ borderRadius: 2, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box>
              <Typography variant="h6">{module.title}</Typography>
              {module.description && (
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {lessonsByModule[module.id]?.length > 0 ? (
              <Box>
                {lessonsByModule[module.id].map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isInProgress = !isCompleted && lesson.id === lastViewedLessonId;

                  let status = 'Not Started';
                  let color = 'default';
                  if (isCompleted) {
                    status = 'Completed';
                    color = 'success';
                  } else if (isInProgress) {
                    status = 'In Progress';
                    color = 'warning';
                  }

                  return (
                    <Box
                      key={lesson.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        px: 1,
                        '&:hover': { backgroundColor: '#f9f9f9', borderRadius: 1 }
                      }}
                    >
                      <Typography>
                        <Link to={`/student/courses/${courseId}/lessons/${lesson.id}`} style={{ textDecoration: 'none' }}>
                          {lesson.title}
                        </Link>
                      </Typography>
                      <Chip label={status} color={color} size="small" />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography color="text.secondary">No lessons available for this module.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CourseView;

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Paper
} from '@mui/material';
import axios from 'axios';

const QuizView = ({ lessonId }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Fetch quiz + questions for this lesson
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizRes = await axios.get(`/api/quizzes/getall`);
        const thisQuiz = quizRes.data.find((q) => q.lesson_id === Number(lessonId));
        if (!thisQuiz) return setError('Quiz not found for this lesson.');
        setQuiz(thisQuiz);

        const questionRes = await axios.get(`/api/questions/getall`);
        const filtered = questionRes.data.filter((q) => q.quizz_id === thisQuiz.id);
        setQuestions(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to load quiz.');
      }
    };
    loadQuiz();
  }, [lessonId]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post('/api/quizzes/submit', {
        quiz_id: quiz.id,
        answers
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>;
  if (!quiz || questions.length === 0) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📝 Quiz</Typography>

      {submitted && result ? (
        <Alert severity="success" sx={{ my: 2 }}>
          ✅ Score: {result.score} / {result.total}
        </Alert>
      ) : (
        <Paper sx={{ p: 2, mb: 3 }}>
          {questions.map((q, index) => (
            <Box key={q.id} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                {index + 1}. {q.question_text}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                >
                  {q.options.map((opt, i) => (
                    <FormControlLabel
                      key={i}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                      disabled={submitted}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          {!submitted && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length || submitting}
            >
              Submit Quiz
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default QuizView;

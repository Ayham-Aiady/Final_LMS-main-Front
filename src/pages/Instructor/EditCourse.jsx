// EditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';



const EditCourse = () => {
  const { user } = useAuth();
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // 🔧 Core State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    category_id: '',
    modules: []
  });

  // 📥 Fetch all course content on mount
  useEffect(() => {
    const fetchFullCourse = async () => {
      try {
        setIsLoading(true);
        const courseRes = await axios.get(`/api/courses/get/${courseId}`);
        const baseCourse = courseRes.data;

        const modulesRes = await axios.get(`/api/modules/course/${courseId}`);
        const modules = modulesRes.data;

        const modulesWithLessons = await Promise.all(
          modules.map(async (mod) => {
            const lessonsRes = await axios.get(`/api/lessons/getall`);
            const lessons = lessonsRes.data.filter(l => l.module_id === mod.id);

            const fullLessons = await Promise.all(
              lessons.map(async (lesson) => {
                if (lesson.content_type === 'quiz') {
                  const quizzes = await axios.get(`/api/quizzes/getall`);
                  const quiz = quizzes.data.find(q => q.lesson_id === lesson.id);

                  let questions = [];
                  if (quiz) {
                    const questionRes = await axios.get(`/api/questions/getall`);
                    questions = questionRes.data.filter(q => q.quizz_id === quiz.id);
                  }

                  return {
                    ...lesson,
                    quiz: quiz ? {
                      id: quiz.id,
                      max_score: quiz.max_score,
                      questions
                    } : null
                  };
                }
                return lesson;
              })
            );

            return {
              ...mod,
              lessons: fullLessons
            };
          })
        );

        setCourseData({ ...baseCourse, modules: modulesWithLessons });
      } catch (err) {
        console.error(err);
        setError('Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullCourse();
  }, [courseId]);

  // 🔁 Helpers to update nested structure in state
  const updateLesson = (mIdx, lIdx, key, value) => {
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx][key] = value;
    setCourseData({ ...courseData, modules: updated });
  };

  const updateLessonQuiz = (mIdx, lIdx, key, value) => {
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx].quiz[key] = value;
    setCourseData({ ...courseData, modules: updated });
  };

  const updateQuestion = (mIdx, lIdx, qIdx, key, value) => {
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx].quiz.questions[qIdx][key] = value;
    setCourseData({ ...courseData, modules: updated });
  };

  const updateQuestionOption = (mIdx, lIdx, qIdx, oIdx, value) => {
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx].quiz.questions[qIdx].options[oIdx] = value;
    setCourseData({ ...courseData, modules: updated });
  };

  // 💾 Save entire course structure
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let thumbnail_url = courseData.thumbnail_url;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);
        const uploadRes = await axios.post('/api/upload', formData);
        thumbnail_url = uploadRes.data.attachment.secure_url;
      }

      await axios.put(`/api/courses/update/${courseId}`, {
        title: courseData.title,
        description: courseData.description,
        thumbnail_url
      });

      for (const mod of courseData.modules) {
        await axios.put(`/api/modules/update/${mod.id}`, {
          title: mod.title,
          description: mod.description,
          order: mod.order
        });

        for (const lesson of mod.lessons) {
          let content_url = lesson.content_url;

          if (lesson.content_type === 'video' && lesson.videoFile) {
            const lessonFormData = new FormData();
            lessonFormData.append('file', lesson.videoFile);
            const uploadRes = await axios.post('/api/upload', lessonFormData);
            content_url = uploadRes.data.attachment.secure_url;
          }

          await axios.put(`/api/lessons/update/${lesson.id}`, {
            title: lesson.title,
            content_type: lesson.content_type,
            content_url,
            duration: lesson.duration,
            order: lesson.order
          });

          if (lesson.quiz) {
            await axios.put(`/api/quizzes/update/${lesson.quiz.id}`, {
              lesson_id: lesson.id,
              max_score: lesson.quiz.max_score
            });

            for (const q of lesson.quiz.questions) {
              if (!q.options.includes(q.correct_answer)) {
                throw new Error(`Correct answer must be one of the options for: ${q.question_text}`);
              }

              await axios.put(`/api/questions/update/${q.id}`, {
                question_text: q.question_text,
                options: q.options,
                correct_answer: q.correct_answer,
                quizz_id: lesson.quiz.id
              });
            }
          }
        }
      }

      alert('✅ Course and all updates saved!');
    } catch (err) {
      console.error(err);
      alert('❌ Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  // 🗑️ delete handlers
const handleDeleteCourse = async (courseId) => {
  if (!window.confirm("❗ Are you sure you want to permanently delete this course and all its contents?")) return;

  try {
    for (const mod of courseData.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.quiz?.questions?.length) {
          for (const q of lesson.quiz.questions) {
            if (q.id) await axios.delete(`/api/questions/delete/${q.id}`);
          }
        }

        if (lesson.quiz?.id) {
          await axios.delete(`/api/quizzes/delete/${lesson.quiz.id}`);
        }

        if (lesson.id) {
          await axios.delete(`/api/lessons/delete/${lesson.id}`);
        }
      }

      if (mod.id) {
        await axios.delete(`/api/modules/delete/${mod.id}`);
      }
    }

    await axios.delete(`/api/courses/delete/${courseId}`);
    alert("✅ Course and all child entities deleted successfully!");
    navigate("/instructor/my-courses");
  } catch (err) {
    console.error("❌ Deletion error:", err);
    alert("Failed to delete course or one of its dependencies.");
  }
};





  const handleDeleteModule = async (moduleId, mIdx) => {
  const updated = [...courseData.modules];
  const mod = updated[mIdx];

  try {
    for (let lIdx = mod.lessons.length - 1; lIdx >= 0; lIdx--) {
      const lesson = mod.lessons[lIdx];

      if (lesson.quiz?.questions?.length) {
        for (const q of lesson.quiz.questions) {
          if (q.id) await axios.delete(`/api/questions/delete/${q.id}`);
        }
      }

      if (lesson.quiz?.id) {
        await axios.delete(`/api/quizzes/delete/${lesson.quiz.id}`);
      }

      if (lesson.id) {
        await axios.delete(`/api/lessons/delete/${lesson.id}`);
      }
    }

    if (!moduleId) {
  console.warn("Skipping delete — module has no ID (probably unsaved).");
  updated.splice(mIdx, 1);
  setCourseData({ ...courseData, modules: updated });
  return;
}

await axios.delete(`/api/modules/delete/${moduleId}`);

    updated.splice(mIdx, 1);
    setCourseData({ ...courseData, modules: updated });
  } catch (err) {
    console.error(err);
    alert('❌ Could not delete module');
  }
};



  const handleDeleteLesson = async (lessonId, mIdx, lIdx) => {
  const updated = [...courseData.modules];
  const lesson = updated[mIdx].lessons[lIdx];

  if (!lessonId) {
    updated[mIdx].lessons.splice(lIdx, 1);
    setCourseData({ ...courseData, modules: updated });
    return;
  }

  try {
    if (lesson.quiz?.questions?.length) {
      for (const q of lesson.quiz.questions) {
        if (q.id) await axios.delete(`/api/questions/delete/${q.id}`);
      }
    }

    if (lesson.quiz?.id) {
      await axios.delete(`/api/quizzes/delete/${lesson.quiz.id}`);
    }

    await axios.delete(`/api/lessons/delete/${lessonId}`);

    updated[mIdx].lessons.splice(lIdx, 1);
    setCourseData({ ...courseData, modules: updated });
  } catch (err) {
    console.error(err);
    alert('❌ Could not delete lesson');
  }
};




  const handleDeleteQuestion = async (questionId, mIdx, lIdx, qIdx) => {
  const updated = [...courseData.modules];

  if (!questionId) {
    updated[mIdx].lessons[lIdx].quiz.questions.splice(qIdx, 1);
    if (updated[mIdx].lessons[lIdx].quiz.questions.length === 0) {
      updated[mIdx].lessons[lIdx].quiz = null;
    }
    setCourseData({ ...courseData, modules: updated });
    return;
  }

  try {
    await axios.delete(`/api/questions/delete/${questionId}`);
    updated[mIdx].lessons[lIdx].quiz.questions.splice(qIdx, 1);

    if (updated[mIdx].lessons[lIdx].quiz.questions.length === 0) {
      updated[mIdx].lessons[lIdx].quiz = null;
    }

    setCourseData({ ...courseData, modules: updated });
  } catch (err) {
    console.error(err);
    alert("❌ Could not delete question");
  }
};


    if (isLoading) return <div className="container mt-5">⏳ Loading course...</div>;
  if (error) return <div className="container mt-5 text-danger">❌ {error}</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>✏️ Edit Course</h2>
        <Link to="/instructor/my-courses" className="btn btn-outline-secondary">
          ⬅️ Back to My Courses
        </Link>
      </div>
      <button
  className="btn btn-outline-danger btn-sm mt-2"
  onClick={() => handleDeleteCourse(courseId)} 

>
  🗑️ Delete Course
</button>


      {/* Course Title & Description */}
      <input
        className="form-control mb-2"
        placeholder="Course Title"
        value={courseData.title}
        onChange={e => setCourseData({ ...courseData, title: e.target.value })}
      />
      <textarea
        className="form-control mb-3"
        placeholder="Course Description"
        value={courseData.description}
        onChange={e => setCourseData({ ...courseData, description: e.target.value })}
      />

      {/* Thumbnail Upload */}
      <input
        type="file"
        className="form-control mb-2"
        onChange={e => setThumbnailFile(e.target.files[0])}
      />
      {courseData.thumbnail_url && (
        <img
          src={courseData.thumbnail_url}
          alt="Thumbnail"
          className="img-thumbnail mb-3"
          style={{ maxWidth: '200px' }}
        />
      )}

      {/* MODULES */}
      {courseData.modules.map((mod, mIdx) => (
        <div key={mod.id || mIdx} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5>📦 Module {mIdx + 1}</h5>
            <input
              className="form-control mb-2"
              placeholder="Module Title"
              value={mod.title}
              onChange={e => {
                const updated = [...courseData.modules];
                updated[mIdx].title = e.target.value;
                setCourseData({ ...courseData, modules: updated });
              }}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Module Description"
              value={mod.description}
              onChange={e => {
                const updated = [...courseData.modules];
                updated[mIdx].description = e.target.value;
                setCourseData({ ...courseData, modules: updated });
              }}
            />

            <button
              className="btn btn-danger btn-sm mb-3"
              onClick={() => handleDeleteModule(mod.id, mIdx)}
            >
              🗑️ Delete Module
            </button>

            {/* LESSONS */}
            {mod.lessons.map((lesson, lIdx) => (
              <div key={lesson.id || lIdx} className="border p-3 rounded mb-3">
                <h6>📘 Lesson {lIdx + 1}</h6>
               <input
  className="form-control mb-2"
  placeholder="Lesson Title"
  value={lesson.title}
  onChange={e => {
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx].title = e.target.value;
    setCourseData({ ...courseData, modules: updated });
  }}
/>

                <select
  className="form-select mb-2"
  value={lesson.content_type}
  onChange={e => {
    const type = e.target.value;
    const updated = [...courseData.modules];
    updated[mIdx].lessons[lIdx].content_type = type;

    // 🧠 When switching to quiz: create the quiz object immediately
    if (type === 'quiz') {
      updated[mIdx].lessons[lIdx].quiz = {
        max_score: 0,
        questions: [
          {
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: ''
          }
        ]
      };
    } else {
      // 🔁 Clear out quiz if switching to a non-quiz type
      updated[mIdx].lessons[lIdx].quiz = null;
    }

    setCourseData({ ...courseData, modules: updated });
  }}
  disabled={!!lesson.quiz} // Optional: disable switching after quiz exists
>
  <option value="video">Video</option>
  <option value="quiz">Quiz</option>
  <option value="text">Text</option>
</select>

                {lesson.content_type === 'video' && (
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control mb-2"
                    onChange={e => updateLesson(mIdx, lIdx, 'videoFile', e.target.files[0])}
                  />
                )}
                <input
                  className="form-control mb-2"
                  placeholder="Content URL or Text"
                  value={lesson.content_url}
                  onChange={e => updateLesson(mIdx, lIdx, 'content_url', e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Duration (minutes)"
                  value={lesson.duration}
                  onChange={e => updateLesson(mIdx, lIdx, 'duration', parseInt(e.target.value))}
                />
                <button
                  className="btn btn-danger btn-sm mb-2"
                  onClick={() => handleDeleteLesson(lesson.id, mIdx, lIdx)}
                >
                  🗑️ Delete Lesson
                </button>

                {/* QUIZ + QUESTIONS */}
                {lesson.quiz && (
                  <div className="bg-light p-3 rounded">
                    <h6>🧠 Quiz</h6>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Max Score"
                      value={lesson.quiz.max_score}
                      onChange={e => updateLessonQuiz(mIdx, lIdx, 'max_score', parseInt(e.target.value))}
                    />
                    {lesson.quiz.questions.map((q, qIdx) => (
                      <div key={q.id || qIdx} className="mb-3">
                        <input
                          className="form-control mb-1"
                          placeholder="Question Text"
                          value={q.question_text}
                          onChange={e => updateQuestion(mIdx, lIdx, qIdx, 'question_text', e.target.value)}
                        />
                        {Array.isArray(q.options) && q.options.map((opt, oIdx) => (
                          <input
                            key={oIdx}
                            className="form-control mb-1"
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={e => updateQuestionOption(mIdx, lIdx, qIdx, oIdx, e.target.value)}
                          />
                        ))}
                        <select
                        className="form-select mb-1"
                        value={q.correct_answer}
                        onChange={e => updateQuestion(mIdx, lIdx, qIdx, 'correct_answer', e.target.value)}
                        >
                        <option value="">-- Correct Answer --</option>
                        {Array.isArray(q.options) ? (
                            q.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                                {opt || `Option ${oIdx + 1}`}
                            </option>
                            ))
                        ) : (
                            <option disabled>⚠️ Options not available</option>
                        )}
                        </select>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteQuestion(q.id, mIdx, lIdx, qIdx)}
                        >
                          🗑️ Delete Question
                        </button>
                      </div>
                    ))}

                    {/* ➕ Add Question */}
                    <button
  className="btn btn-outline-success btn-sm"
  onClick={() => {
    const updated = [...courseData.modules];
    
    // ✅ Ensure .questions array exists
    if (!updated[mIdx].lessons[lIdx].quiz.questions) {
      updated[mIdx].lessons[lIdx].quiz.questions = [];
    }

    updated[mIdx].lessons[lIdx].quiz.questions.push({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: ''
    });

    setCourseData({ ...courseData, modules: updated });
  }}
>
  ➕ Add Question
</button>

                  </div>
                )}
              </div>
            ))}

            {/* ➕ Add Lesson Button */}
            <button
              className="btn btn-outline-primary btn-sm "
              onClick={() => {
                const updated = [...courseData.modules];
                updated[mIdx].lessons.push({
                  title: '',
                  content_type: 'video',
                  content_url: '',
                  duration: 0,
                  order: updated[mIdx].lessons.length + 1,
                  videoFile: null,
                  quiz: null
                });
                setCourseData({ ...courseData, modules: updated });
              }}
            >
              ➕ Add Lesson
            </button>
          </div>
        </div>
      ))}

      {/* ➕ Add Module */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => {
          const updated = [...courseData.modules];
          updated.push({
            title: '',
            description: '',
            order: updated.length + 1,
            lessons: []
          });
          setCourseData({ ...courseData, modules: updated });
        }}
      >
        ➕ Add Module
      </button>

      {/* 💾 Save Button */}
      <div className="text-end">
        <button
          className="btn btn-success"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditCourse;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/authContext.jsx';

// const CreateCourse = () => {
//   const { user } = useAuth();
//   const instructorId = user?.id;

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [course, setCourse] = useState({
//     title: '',
//     description: '',
//     category_id: '',
//     thumbnail_url: '',
//     modules: []
//   });

//   useEffect(() => {
//     axios.get('/api/categories/getall')
//       .then(res => setCategories(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const handleAddModule = () => {
//     setCourse(prev => ({
//       ...prev,
//       modules: [
//         ...prev.modules,
//         {
//           title: '',
//           description: '',
//           order: prev.modules.length + 1,
//           lessons: []
//         }
//       ]
//     }));
//   };

//   const handleAddLesson = (moduleIndex) => {
//     const modules = [...course.modules];
//     modules[moduleIndex].lessons.push({
//       title: '',
//       content_type: 'video',
//       content_url: '',
//       videoFile: null,
//       duration: 0,
//       order: modules[moduleIndex].lessons.length + 1,
//       quiz: null
//     });
//     setCourse({ ...course, modules });
//   };

//   const handleModuleChange = (i, key, value) => {
//     const modules = [...course.modules];
//     modules[i][key] = value;
//     setCourse({ ...course, modules });
//   };

//   const handleLessonChange = (mIdx, lIdx, key, value) => {
//     const modules = [...course.modules];
//     modules[mIdx].lessons[lIdx][key] = value;
//     setCourse({ ...course, modules });
//   };

//   const handleAddQuiz = (mIdx, lIdx) => {
//     const modules = [...course.modules];
//     modules[mIdx].lessons[lIdx].quiz = {
//       max_score: 10,
//       questions: [
//         { question_text: '', options: ['', '', '', ''], correct_answer: '' }
//       ]
//     };
//     setCourse({ ...course, modules });
//   };

//   const handleQuizChange = (mIdx, lIdx, key, value) => {
//     const modules = [...course.modules];
//     modules[mIdx].lessons[lIdx].quiz[key] = value;
//     setCourse({ ...course, modules });
//   };

//   const handleQuestionChange = (mIdx, lIdx, qIdx, key, value) => {
//     const modules = [...course.modules];
//     modules[mIdx].lessons[lIdx].quiz.questions[qIdx][key] = value;
//     setCourse({ ...course, modules });
//   };

//   const handleOptionChange = (mIdx, lIdx, qIdx, optIdx, value) => {
//     const modules = [...course.modules];
//     modules[mIdx].lessons[lIdx].quiz.questions[qIdx].options[optIdx] = value;
//     setCourse({ ...course, modules });
//   };

//   const handleSubmit = async () => {
//   if (isSubmitting) return; // 🔒 Prevent duplicate submissions
//   setIsSubmitting(true);     // 🕒 Show loading state

//   try {
//     // 🖼️ Step 1: Upload thumbnail (if selected)
//     let thumbnail_url = course.thumbnail_url;
//     if (thumbnailFile) {
//       const formData = new FormData();
//       formData.append("file", thumbnailFile);
//       const uploadRes = await axios.post("/api/upload", formData);
//       thumbnail_url = uploadRes.data.attachment.secure_url;
//     }

//     // ✅ Step 2: Validate required fields before submission
//     if (
//       !course.title.trim() ||
//       !course.description.trim() ||
//       !course.category_id ||
//       isNaN(parseInt(course.category_id)) ||
//       !instructorId ||
//       isNaN(parseInt(instructorId)) ||
//       !thumbnail_url
//     ) {
//       alert("🚧 Please fill in all required fields before submitting.");
//       return;
//     }

//     // 📘 Step 3: Create Course entry
//     const courseRes = await axios.post("/api/courses/create", {
//       title: course.title,
//       description: course.description,
//       category_id: parseInt(course.category_id),
//       instructor_id: parseInt(instructorId),
//       thumbnail_url,
//     });
//     const courseId = courseRes.data.id;

//     // 🧱 Step 4: Create each module
//     for (const mod of course.modules) {
//       const moduleRes = await axios.post("/api/modules/create", {
//         title: mod.title,
//         description: mod.description,
//         order: mod.order,
//         course_id: courseId,
//       });
//       const moduleId = moduleRes.data.id;

//       // 📚 Step 5: Create lessons within the module
//       for (const lesson of mod.lessons) {
//         let content_url = lesson.content_url;

//         // 🎥 Step 5a: Upload video if lesson type is 'video'
//         if (lesson.content_type === 'video' && lesson.videoFile) {
//           const lessonFormData = new FormData();
//           lessonFormData.append("file", lesson.videoFile);
//           const uploadRes = await axios.post("/api/upload", lessonFormData);
//           content_url = uploadRes.data.attachment.secure_url;
//         }

//         // ✍️ Step 5b: Create lesson with correct content_url
//         const lessonRes = await axios.post("/api/lessons/create", {
//           title: lesson.title,
//           content_type: lesson.content_type,
//           content_url,
//           duration: lesson.duration,
//           order: lesson.order,
//           module_id: moduleId,
//         });
//         const lessonId = lessonRes.data.id;

//         // 🧠 Step 6: If it's a quiz lesson, create quiz + questions
//         if (lesson.content_type === "quiz" && lesson.quiz) {
//           const quizRes = await axios.post("/api/quizzes/create", {
//             lesson_id: lessonId,
//             max_score: lesson.quiz.max_score || 10,
//           });
//           const quizId = quizRes.data.id;

//           // ✅ Step 6a: Validate + create each question
//           for (const q of lesson.quiz.questions) {
//             if (!q.options.includes(q.correct_answer)) {
//               throw new Error(`Correct answer must match one of the options for question: "${q.question_text}"`);
//             }

//             await axios.post("/api/questions/create", {
//               quizz_id: quizId,
//               question_text: q.question_text,
//               options: q.options,
//               correct_answer: q.correct_answer,
//             });
//           }
//         }
//       }
//     }

//     // 🎉 Step 7: Notify success and reset form
//     alert("🎉 Course and its full structure created successfully!");
//     setCourse({
//       title: '',
//       description: '',
//       category_id: '',
//       thumbnail_url: '',
//       modules: []
//     });
//     setThumbnailFile(null);
//   } catch (err) {
//     // ❌ Step 8: Handle errors cleanly
//     console.error("❌ Error during course creation:", err.response?.data || err.message);
//     alert("🚨 Something went wrong: " + (err.response?.data?.message || "Unexpected error."));
//   } finally {
//     // 🔄 Always reset the loading state
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <div className="container mt-5 mb-5">
//       <h2 className="mb-4">📘 Create a New Course</h2>

//       <div className="mb-3">
//         <input className="form-control" placeholder="Course Title"
//           onChange={e => setCourse({ ...course, title: e.target.value })} />
//       </div>

//       <div className="mb-3">
//         <textarea className="form-control" placeholder="Course Description"
//           onChange={e => setCourse({ ...course, description: e.target.value })} />
//       </div>

//       <div className="mb-3">
//         <select className="form-select"
//           onChange={e => setCourse({ ...course, category_id: e.target.value })}>
//           <option value="">-- Select Category --</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <input type="file" className="form-control mb-2"
//           onChange={(e) => setThumbnailFile(e.target.files[0])} />
//       </div>

//       <hr />
//       <button className="btn btn-outline-primary mb-4" onClick={handleAddModule}>+ Add Module</button>

//       {course.modules.map((mod, mIdx) => (
//         <div className="card mb-3" key={mIdx}>
//           <div className="card-body">
//             <h5 className="card-title">Module {mIdx + 1}</h5>

//             <input className="form-control mb-2" placeholder="Module Title"
//               value={mod.title} onChange={e => handleModuleChange(mIdx, 'title', e.target.value)} />

//             <textarea className="form-control mb-2" placeholder="Module Description"
//               value={mod.description} onChange={e => handleModuleChange(mIdx, 'description', e.target.value)} />

//             <button className="btn btn-sm btn-secondary mb-2" onClick={() => handleAddLesson(mIdx)}>+ Add Lesson</button>

//             {mod.lessons.map((lesson, lIdx) => (
//               <div className="border rounded p-3 mb-3" key={lIdx}>
//                 <h6>Lesson {lIdx + 1}</h6>

//                 <input className="form-control mb-2" placeholder="Lesson Title"
//                   value={lesson.title}
//                   onChange={e => handleLessonChange(mIdx, lIdx, 'title', e.target.value)} />

//                                 <select className="form-select mb-2"
//                   value={lesson.content_type}
//                   onChange={e => handleLessonChange(mIdx, lIdx, 'content_type', e.target.value)}
//                   disabled={!!lesson.quiz}>
//                   <option value="video">Video</option>
//                   <option value="quiz">Quiz</option>
//                   <option value="text">Text</option>
//                 </select>

//                 {lesson.content_type === 'video' && (
//                   <input
//                     type="file"
//                     accept="video/*"
//                     className="form-control mb-2"
//                     onChange={e => handleLessonChange(mIdx, lIdx, 'videoFile', e.target.files[0])}
//                   />
//                 )}

//                 <input
//                   className="form-control mb-2"
//                   placeholder="Content URL or Text"
//                   value={lesson.content_url}
//                   onChange={e => handleLessonChange(mIdx, lIdx, 'content_url', e.target.value)}
//                 />

//                 <input
//                   type="number"
//                   className="form-control mb-2"
//                   placeholder="Duration (minutes)"
//                   value={lesson.duration}
//                   onChange={e => handleLessonChange(mIdx, lIdx, 'duration', parseInt(e.target.value))}
//                 />

//                 {lesson.content_type === 'quiz' && !lesson.quiz && (
//                   <button className="btn btn-sm btn-warning" onClick={() => handleAddQuiz(mIdx, lIdx)}>+ Add Quiz</button>
//                 )}

//                 {lesson.quiz && (
//                   <div className="mt-3 bg-light p-3 rounded">
//                     <input
//                       type="number"
//                       className="form-control mb-2"
//                       placeholder="Max Score"
//                       value={lesson.quiz.max_score}
//                       onChange={e => handleQuizChange(mIdx, lIdx, 'max_score', parseInt(e.target.value))}
//                     />
//                     {lesson.quiz.questions.map((q, qIdx) => (
//                       <div key={qIdx} className="mb-3">
//                         <input
//                           className="form-control mb-1"
//                           placeholder="Question Text"
//                           value={q.question_text}
//                           onChange={e => handleQuestionChange(mIdx, lIdx, qIdx, 'question_text', e.target.value)}
//                         />
//                         {q.options.map((opt, optIdx) => (
//                           <input
//                             key={optIdx}
//                             className="form-control mb-1"
//                             placeholder={`Option ${optIdx + 1}`}
//                             value={opt}
//                             onChange={e => handleOptionChange(mIdx, lIdx, qIdx, optIdx, e.target.value)}
//                           />
//                         ))}
//                         <select
//                           className="form-select"
//                           value={q.correct_answer}
//                           onChange={e => handleQuestionChange(mIdx, lIdx, qIdx, 'correct_answer', e.target.value)}
//                         >
//                           <option value="">-- Select Correct Answer --</option>
//                           {q.options.map((opt, idx) => (
//                             <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
//                           ))}
//                         </select>

//                       </div>
//                     ))}
//                     <button
//                       className="btn btn-outline-success btn-sm"
//                       onClick={() => {
//                         const updated = [...course.modules];
//                         updated[mIdx].lessons[lIdx].quiz.questions.push({
//                           question_text: '',
//                           options: ['', '', '', ''],
//                           correct_answer: ''
//                         });
//                         setCourse({ ...course, modules: updated });
//                       }}
//                     >+ Add Question</button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}

//       <div className="text-end">
//         <button
//           className="btn btn-primary"
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? '⏳ Creating...' : '🚀 Create Course'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';

const CreateCourse = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [course, setCourse] = useState({
    title: '',
    description: '',
    category_id: '',
    thumbnail_url: '',
    modules: []
  });

  useEffect(() => {
    axios.get('/api/categories/getall')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: '',
          description: '',
          order: prev.modules.length + 1,
          lessons: []
        }
      ]
    }));
  };

  const handleAddLesson = (moduleIndex) => {
    const modules = [...course.modules];
    modules[moduleIndex].lessons.push({
      title: '',
      content_type: 'video',
      content_url: '',
      videoFile: null,
      markdownFile: null,
      duration: 0,
      order: modules[moduleIndex].lessons.length + 1,
      quiz: null
    });
    setCourse({ ...course, modules });
  };

  const handleModuleChange = (i, key, value) => {
    const modules = [...course.modules];
    modules[i][key] = value;
    setCourse({ ...course, modules });
  };

  const handleLessonChange = (mIdx, lIdx, key, value) => {
    const modules = [...course.modules];
    modules[mIdx].lessons[lIdx][key] = value;
    setCourse({ ...course, modules });
  };

  const handleAddQuiz = (mIdx, lIdx) => {
    const modules = [...course.modules];
    modules[mIdx].lessons[lIdx].quiz = {
      max_score: 10,
      questions: [
        { question_text: '', options: ['', '', '', ''], correct_answer: '' }
      ]
    };
    setCourse({ ...course, modules });
  };

  const handleQuizChange = (mIdx, lIdx, key, value) => {
    const modules = [...course.modules];
    modules[mIdx].lessons[lIdx].quiz[key] = value;
    setCourse({ ...course, modules });
  };

  const handleQuestionChange = (mIdx, lIdx, qIdx, key, value) => {
    const modules = [...course.modules];
    modules[mIdx].lessons[lIdx].quiz.questions[qIdx][key] = value;
    setCourse({ ...course, modules });
  };

  const handleOptionChange = (mIdx, lIdx, qIdx, optIdx, value) => {
    const modules = [...course.modules];
    modules[mIdx].lessons[lIdx].quiz.questions[qIdx].options[optIdx] = value;
    setCourse({ ...course, modules });
  };

  const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    let thumbnail_url = course.thumbnail_url;

    // Upload course thumbnail if selected
    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("file", thumbnailFile);
      const uploadRes = await axios.post("/api/upload", formData);
      thumbnail_url = uploadRes.data.attachment.secure_url;
    }

    // Validate core course fields
    if (
      !course.title.trim() ||
      !course.description.trim() ||
      !course.category_id ||
      !thumbnail_url ||
      !instructorId
    ) {
      alert("🚧 Please fill in all required fields.");
      return;
    }

    // Create Course
    const courseRes = await axios.post("/api/courses/create", {
      title: course.title,
      description: course.description,
      category_id: parseInt(course.category_id),
      instructor_id: parseInt(instructorId),
      thumbnail_url,
    });
    const courseId = courseRes.data.id;

    // Create Modules + Lessons
    for (const mod of course.modules) {
      const moduleRes = await axios.post("/api/modules/create", {
        title: mod.title,
        description: mod.description,
        order: mod.order,
        course_id: courseId,
      });
      const moduleId = moduleRes.data.id;

      for (const lesson of mod.lessons) {
        // Create Lesson first (no file yet)
        const lessonRes = await axios.post("/api/lessons/create", {
          title: lesson.title,
          content_type: lesson.content_type,
          content_url: "", // can be empty; we're uploading file next
          duration: lesson.duration,
          order: lesson.order,
          module_id: moduleId,
        });
        const lessonId = lessonRes.data.id;

        // Upload file with lesson_id
        if (lesson.content_type === 'video' && lesson.videoFile) {
          const videoData = new FormData();
          videoData.append("file", lesson.videoFile);
          videoData.append("lesson_id", lessonId);
          await axios.post("/api/upload", videoData);
        } else if (lesson.content_type === 'text' && (lesson.markdownFile || lesson.wordFile)) {
          const textData = new FormData();
          textData.append("file", lesson.markdownFile || lesson.wordFile);
          textData.append("lesson_id", lessonId);
          await axios.post("/api/upload", textData);
        }

        // Handle quiz
        if (lesson.content_type === "quiz" && lesson.quiz) {
          const quizRes = await axios.post("/api/quizzes/create", {
            lesson_id: lessonId,
            max_score: lesson.quiz.max_score || 10,
          });
          const quizId = quizRes.data.id;

          for (const q of lesson.quiz.questions) {
            if (!q.options.includes(q.correct_answer)) {
              throw new Error(`Correct answer must match one of the options.`);
            }

            await axios.post("/api/questions/create", {
              quizz_id: quizId,
              question_text: q.question_text,
              options: q.options,
              correct_answer: q.correct_answer,
            });
          }
        }
      }
    }

    alert("🎉 Course and all contents created successfully!");
    setCourse({ title: '', description: '', category_id: '', thumbnail_url: '', modules: [] });
    setThumbnailFile(null);
  } catch (err) {
    console.error("Error during course creation:", err);
    alert("🚨 Something went wrong.");
  } finally {
    setIsSubmitting(false);
  }
};


    return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">📘 Create a New Course</h2>

      <div className="mb-3">
        <input className="form-control" placeholder="Course Title"
          onChange={e => setCourse({ ...course, title: e.target.value })} />
      </div>

      <div className="mb-3">
        <textarea className="form-control" placeholder="Course Description"
          onChange={e => setCourse({ ...course, description: e.target.value })} />
      </div>

      <div className="mb-3">
        <select className="form-select"
          onChange={e => setCourse({ ...course, category_id: e.target.value })}>
          <option value="">-- Select Category --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <input type="file" className="form-control mb-2"
          onChange={(e) => setThumbnailFile(e.target.files[0])} />
      </div>

      <hr />
      <button className="btn btn-outline-primary mb-4" onClick={handleAddModule}>+ Add Module</button>

      {course.modules.map((mod, mIdx) => (
        <div className="card mb-3" key={mIdx}>
          <div className="card-body">
            <h5 className="card-title">Module {mIdx + 1}</h5>

            <input className="form-control mb-2" placeholder="Module Title"
              value={mod.title} onChange={e => handleModuleChange(mIdx, 'title', e.target.value)} />

            <textarea className="form-control mb-2" placeholder="Module Description"
              value={mod.description} onChange={e => handleModuleChange(mIdx, 'description', e.target.value)} />

            <button className="btn btn-sm btn-secondary mb-2" onClick={() => handleAddLesson(mIdx)}>+ Add Lesson</button>

            {mod.lessons.map((lesson, lIdx) => (
              <div className="border rounded p-3 mb-3" key={lIdx}>
                <h6>Lesson {lIdx + 1}</h6>

                <input className="form-control mb-2" placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={e => handleLessonChange(mIdx, lIdx, 'title', e.target.value)} />

                <select className="form-select mb-2"
                  value={lesson.content_type}
                  onChange={e => handleLessonChange(mIdx, lIdx, 'content_type', e.target.value)}
                  disabled={!!lesson.quiz}>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="text">Text</option>
                </select>

                {/* Upload for video */}
                {lesson.content_type === 'video' && (
                  <input
                    type="file"
                    accept="video/*"
                    className="form-control mb-2"
                    onChange={e => handleLessonChange(mIdx, lIdx, 'videoFile', e.target.files[0])}
                  />
                )}

                {/* Upload for markdown */}
                {lesson.content_type === 'text' && (
                  <div className="mb-2">
                    <label className="form-label">Upload Markdown (.md)</label>
                    <input
                      type="file"
                      accept=".md"
                      className="form-control"
                      onChange={(e) => handleLessonChange(mIdx, lIdx, 'markdownFile', e.target.files[0])}
                    />
                  </div>
                )}

                {/* Show content_url input only if lesson has no file */}
                {!(lesson.content_type === 'text' && lesson.markdownFile) && (
                  <input
                    className="form-control mb-2"
                    placeholder="Content URL (e.g. for PDFs)"
                    value={lesson.content_url}
                    onChange={e => handleLessonChange(mIdx, lIdx, 'content_url', e.target.value)}
                  />
                )}

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Duration (minutes)"
                  value={lesson.duration}
                  onChange={e => handleLessonChange(mIdx, lIdx, 'duration', parseInt(e.target.value))}
                />

                {lesson.content_type === 'quiz' && !lesson.quiz && (
                  <button className="btn btn-sm btn-warning" onClick={() => handleAddQuiz(mIdx, lIdx)}>+ Add Quiz</button>
                )}

                {/* Quiz editor */}
                {lesson.quiz && (
                  <div className="mt-3 bg-light p-3 rounded">
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Max Score"
                      value={lesson.quiz.max_score}
                      onChange={e => handleQuizChange(mIdx, lIdx, 'max_score', parseInt(e.target.value))}
                    />
                    {lesson.quiz.questions.map((q, qIdx) => (
                      <div key={qIdx} className="mb-3">
                        <input
                          className="form-control mb-1"
                          placeholder="Question Text"
                          value={q.question_text}
                          onChange={e => handleQuestionChange(mIdx, lIdx, qIdx, 'question_text', e.target.value)}
                        />
                        {q.options.map((opt, optIdx) => (
                          <input
                            key={optIdx}
                            className="form-control mb-1"
                            placeholder={`Option ${optIdx + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(mIdx, lIdx, qIdx, optIdx, e.target.value)}
                          />
                        ))}
                        <select
                          className="form-select"
                          value={q.correct_answer}
                          onChange={e => handleQuestionChange(mIdx, lIdx, qIdx, 'correct_answer', e.target.value)}
                        >
                          <option value="">-- Select Correct Answer --</option>
                          {q.options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt || `Option ${idx + 1}`}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => {
                        const updated = [...course.modules];
                        updated[mIdx].lessons[lIdx].quiz.questions.push({
                          question_text: '',
                          options: ['', '', '', ''],
                          correct_answer: ''
                        });
                        setCourse({ ...course, modules: updated });
                      }}
                    >+ Add Question</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-end">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '⏳ Creating...' : '🚀 Create Course'}
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;


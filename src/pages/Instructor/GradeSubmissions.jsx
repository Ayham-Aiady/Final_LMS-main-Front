import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';

const GradeSubmissions = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');

  // Load instructor courses
  useEffect(() => {
    if (instructorId) {
      axios.get(`/api/courses/byinstructor/${instructorId}`)
        .then(res => setCourses(res.data))
        .catch(console.error);
    }
  }, [instructorId]);

  // Load modules
  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/modules/bycourse/${selectedCourse}`)
        .then(res => setModules(res.data))
        .catch(console.error);
    } else {
      setModules([]); setLessons([]); setAssignments([]); setSubmissions([]);
    }
  }, [selectedCourse]);

  // Load lessons
  useEffect(() => {
    if (selectedModule) {
      axios.get(`/api/lessons/bymodule/${selectedModule}`)
        .then(res => setLessons(res.data))
        .catch(console.error);
    } else {
      setLessons([]); setAssignments([]); setSubmissions([]);
    }
  }, [selectedModule]);

  // Load assignments
  useEffect(() => {
    if (selectedLesson) {
      axios.get(`/api/assignments/bylesson/${selectedLesson}`)
        .then(res => setAssignments(res.data))
        .catch(console.error);
    } else {
      setAssignments([]); setSubmissions([]);
    }
  }, [selectedLesson]);

  // Load submissions
  useEffect(() => {
    if (selectedAssignment) {
      axios.get(`/api/submissions/byassignment/${selectedAssignment}`)
        .then(res => setSubmissions(res.data))
        .catch(console.error);
    } else {
      setSubmissions([]);
    }
  }, [selectedAssignment]);

  const handleGrade = async (submissionId, grade, feedback) => {
    try {
      await axios.patch(`/api/submissions/grade/${submissionId}`, { grade, feedback });
      alert('✅ Submission graded!');
      // Refresh submissions
      const updated = await axios.get(`/api/submissions/byassignment/${selectedAssignment}`);
      setSubmissions(updated.data);
    } catch (err) {
      console.error(err);
      alert('❌ Error grading submission');
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧪 Grade Submissions</h2>

      <select className="form-select mb-2" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
        <option value="">-- Select Course --</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <select className="form-select mb-2" value={selectedModule} onChange={e => setSelectedModule(e.target.value)} disabled={!selectedCourse}>
        <option value="">-- Select Module --</option>
        {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>

      <select className="form-select mb-2" value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)} disabled={!selectedModule}>
        <option value="">-- Select Lesson --</option>
        {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
      </select>

      <select className="form-select mb-4" value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)} disabled={!selectedLesson}>
        <option value="">-- Select Assignment --</option>
        {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
      </select>

      {submissions.length === 0 && selectedAssignment && (
        <div className="text-muted">No submissions yet for this assignment.</div>
      )}

      {submissions.map(sub => (
        <div key={sub.id} className="card mb-3">
          <div className="card-body">
            <h5>👤 Student ID: {sub.user_id}</h5>
            <p>📎 <a href={sub.submission_url} target="_blank" rel="noreferrer">View Submission</a></p>
            <p>🕒 Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>

            <div className="row g-2 align-items-center">
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Grade"
                  defaultValue={sub.grade || ''}
                  onChange={e => sub.tempGrade = parseInt(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Feedback"
                  defaultValue={sub.feedback || ''}
                  onChange={e => sub.tempFeedback = e.target.value}
                />
              </div>
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-success"
                  onClick={() => handleGrade(sub.id, sub.tempGrade, sub.tempFeedback)}
                >
                  ✅ Submit Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GradeSubmissions;

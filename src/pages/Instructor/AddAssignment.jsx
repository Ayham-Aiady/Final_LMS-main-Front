import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext.jsx';

const AddAssignment = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    max_score: 100
  });

  // Load instructor's courses
  useEffect(() => {
    if (instructorId) {
      axios.get(`/api/courses/byinstructor/${instructorId}`)
        .then(res => setCourses(res.data))
        .catch(err => console.error(err));
    }
  }, [instructorId]);

  // Load modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      axios.get(`/api/modules/bycourse/${selectedCourse}`)
        .then(res => setModules(res.data))
        .catch(err => console.error(err));
    } else {
      setModules([]);
      setLessons([]);
    }
  }, [selectedCourse]);

  // Load lessons when module is selected
  useEffect(() => {
    if (selectedModule) {
      axios.get(`/api/lessons/bymodule/${selectedModule}`)
        .then(res => setLessons(res.data))
        .catch(err => console.error(err));
    } else {
      setLessons([]);
    }
  }, [selectedModule]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!selectedLesson || !form.title || !file) {
        alert("🚧 Please fill in all fields and upload a file.");
        return;
      }

      // Upload file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post("/api/upload", formData);
      const file_url = uploadRes.data.attachment.secure_url;

      // Create assignment
      await axios.post("/api/assignments/create", {
        lesson_id: selectedLesson,
        title: form.title,
        description: form.description,
        deadline: form.deadline || null,
        max_score: form.max_score || 100,
        file_url
      });

      alert("✅ Assignment uploaded successfully!");
      setForm({ title: '', description: '', deadline: '', max_score: 100 });
      setFile(null);
      setSelectedCourse('');
      setSelectedModule('');
      setSelectedLesson('');
    } catch (err) {
      console.error(err);
      alert("🚨 Error uploading assignment: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📎 Add Assignment to Lesson</h2>

      <select className="form-select mb-3" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
        <option value="">-- Select Course --</option>
        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <select className="form-select mb-3" value={selectedModule} onChange={e => setSelectedModule(e.target.value)} disabled={!selectedCourse}>
        <option value="">-- Select Module --</option>
        {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>

      <select className="form-select mb-3" value={selectedLesson} onChange={e => setSelectedLesson(e.target.value)} disabled={!selectedModule}>
        <option value="">-- Select Lesson --</option>
        {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
      </select>

      <input className="form-control mb-2" placeholder="Assignment Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea className="form-control mb-2" placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="date" className="form-control mb-2" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
      <input type="number" className="form-control mb-3" placeholder="Max Score (default 100)" value={form.max_score} onChange={e => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />

      <input type="file" className="form-control mb-3" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} />

      <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "⏳ Uploading..." : "🚀 Upload Assignment"}
      </button>
    </div>
  );
};

export default AddAssignment;

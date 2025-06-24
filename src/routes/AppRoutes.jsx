// AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import PrivateRoute from '../routes/PrivateRoute.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';


import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';


import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import StudentDashboard from '../pages/Dashboard/StudentDashboard.jsx';
import InstructorDashboard from '../pages/Dashboard/InstructorDashboard.jsx';
import AdminDashboard from '../pages/Dashboard/AdminDashboard.jsx';


import UserManagement from '../pages/Admin/UserManagement.jsx';
import DashboardSummary from '../pages/Admin/DashboardSummary.jsx';
import CoursePopularity from '../pages/Admin/CoursePopularity.jsx';
import CourseModeration from '../pages/Admin/CourseModeration.jsx';
import AdminLayout from '../main-layouts/AdminLayout.jsx';

import CreateCourse from '../pages/Instructor/CreateCourse.jsx'; 
import InstructorCourses from '../pages/Instructor/InstructorCourses.jsx';
import EditCourse from '../pages/Instructor/EditCourse.jsx';
import AddAssignment from '../pages/Instructor/AddAssignment.jsx';
import GradeSubmissions from '../pages/Instructor/GradeSubmissions.jsx';
import StudentAnalytics from '../pages/Instructor/StudentAnalytics.jsx';
import InstructorLayout from '../main-layouts/InstructorLayout.jsx';

import StudentLayout from '../main-layouts/StudentLayout.jsx';
import ExploreCourses from '../pages/student/ExploreCourses.jsx';
import CourseDetails from '../pages/student/CourseDetails.jsx';
import StudentCourses from '../pages/student/StudentCourses.jsx';
import EnrolledCourses from '../pages/student/EnrolledCourses.jsx';
import CourseView from '../pages/student/CourseView.jsx';
import LessonView from '../pages/student/LessonView.jsx';
import Assignments from '../pages/student/Assignments.jsx';
import AssignmentPageWrapper from '../pages/student/AssignmentPageWrapper.jsx';











const AppRoutes = () => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />


<Route
  path="/student"
  element={
    <PrivateRoute allowedRoles={['student']}>
      <StudentLayout />
    </PrivateRoute>
  }
>
  <Route index element={<StudentDashboard />} />
  <Route path="dashboard" element={<StudentDashboard />} />
  <Route path="explore" element={<ExploreCourses userId={user?.id} />} />
  <Route path="courses" element={<EnrolledCourses userId={user?.id} />} />
  <Route path="courses/:courseId" element={<CourseDetails userId={user?.id} />} />
  <Route path="courses/:courseId/view" element={<CourseView />} />
  <Route path="courses/:courseId/lessons/:lessonId" element={<LessonView userId={user?.id} />} />
  <Route path="assignments" element={<Assignments />} />
<Route path="assignments/:assignmentId/view" element={<AssignmentPageWrapper />} />

</Route>


<Route
  path="/dashboard/student"
  element={<Navigate to="/student/dashboard" replace />}
/>




     <Route
  path="/instructor"
  element={
    <PrivateRoute allowedRoles={['instructor']}>
      <InstructorLayout />
    </PrivateRoute>
  }
>
  {/* 🏠 This shows at /instructor */}
  <Route index element={<InstructorDashboard />} />

  <Route path="create-course" element={<CreateCourse />} />
  <Route path="my-courses" element={<InstructorCourses />} />
  <Route
    path="edit-course/:id"
    element={
      <ErrorBoundary>
        <EditCourse />
      </ErrorBoundary>
    }
  />
  <Route path="add-assignment" element={<AddAssignment />} />
  <Route path="grade-submissions" element={<GradeSubmissions />} />
  <Route path="student-analytics" element={<StudentAnalytics />} />
</Route>


 <Route
  path="/admin"
  element={
    <PrivateRoute allowedRoles={['admin']}>
      <AdminLayout />
    </PrivateRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
  <Route path="summary" element={<DashboardSummary />} />
  <Route path="course-popularity" element={<CoursePopularity />} />
  <Route path="moderation" element={<CourseModeration />} />
</Route>


      <Route path="*" element={<div className="text-center mt-5">Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;

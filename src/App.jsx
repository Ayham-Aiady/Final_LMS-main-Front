// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '././context/authContext.jsx';
// import PrivateRoute from './routes/PrivateRoute.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
// import Loader from './components/Loader.jsx';


// import dotenv from 'dotenv';

// import Login from './pages/Auth/Login.jsx';
// import Register from './pages/Auth/Register.jsx';
// import Dashboard from './pages/Dashboard/Dashboard.jsx';

// import StudentDashboard from './pages/Dashboard/StudentDashboard.jsx';
// import InstructorDashboard from './pages/Dashboard/InstructorDashboard.jsx';
// import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
{/* <ToastContainer position="top-center" autoClose={3000} /> */}


function App() {
  return (
    
      <Router>
        <AuthProvider>
        <Navbar />
        <AppRoutes />
        <ToastContainer position="top-center" autoClose={3000} />
        </AuthProvider>
      </Router>
    
  );
}



export default App;

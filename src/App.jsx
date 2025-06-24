import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '././context/authContext.jsx';

import AppRoutes from './routes/AppRoutes.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    
      <Router>
        <AuthProvider>
        <Navbar />
        <AppRoutes />
        <Footer />
        <ToastContainer position="top-center" autoClose={3000} />
        </AuthProvider>
      </Router>
    
  );
}



export default App;

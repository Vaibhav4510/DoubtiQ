import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import TutorPanel from './pages/TutorPanel';
import DoubtDetail from './pages/DoubtDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import RefundCancellation from './pages/RefundCancellation';
import PrivateRoute from './components/PrivateRoute';

const DashboardRoute = () => {
  const { user } = useContext(AuthContext);
  
  if (user?.role === 'admin') {
    return <AdminPanel />;
  }
  if (user?.role === 'tutor') {
    return <TutorPanel />;
  }
  if (user?.role === 'user') {
    return <UserDashboard />;
  }
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-cancellation" element={<RefundCancellation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRoute />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutor"
              element={
                <PrivateRoute role={['tutor', 'admin']}>
                  <TutorPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/doubts/:id"
              element={
                <PrivateRoute>
                  <DoubtDetail />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

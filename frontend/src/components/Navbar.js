import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.role === 'admin') return { text: 'Admin', class: 'badge-admin' };
    if (user.role === 'tutor') return { text: 'Tutor', class: 'badge-tutor' };
    return { text: user.subscription?.type === 'premium' ? 'Premium' : 'Free', class: user.subscription?.type === 'premium' ? 'badge-premium' : 'badge-free' };
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💡</span>
          <span className="brand-text">DoubtiQ</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {user ? (
            <>
              <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    <span className="nav-icon">👑</span>
                    Admin Panel
                  </Link>
                )}
                {user.role === 'tutor' && (
                  <Link to="/tutor" className="nav-link">
                    <span className="nav-icon">👨‍🏫</span>
                    Tutor Panel
                  </Link>
                )}
              </div>
              
              <div className="navbar-user">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  {roleBadge && (
                    <span className={`role-badge ${roleBadge.class}`}>
                      {roleBadge.text}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                >
                  <span className="logout-icon">🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="navbar-links">
                <Link to="/about" className="nav-link">
                  About
                </Link>
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </div>
              <div className="navbar-auth">
                <Link to="/login" className="btn-nav btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-nav btn-primary">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">👑</span>
                  Admin Panel
                </Link>
              )}
              {user.role === 'tutor' && (
                <Link to="/tutor" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">👨‍🏫</span>
                  Tutor Panel
                </Link>
              )}
              <div className="mobile-user-info">
                <p className="mobile-user-name">{user.name}</p>
                {roleBadge && (
                  <span className={`role-badge ${roleBadge.class}`}>
                    {roleBadge.text}
                  </span>
                )}
              </div>
              <button onClick={handleLogout} className="mobile-logout">
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

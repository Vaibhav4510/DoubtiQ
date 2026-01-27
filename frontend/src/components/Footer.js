import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">💡</span>
            <span className="footer-logo-text">DoubtiQ</span>
          </div>
          <p className="footer-tagline">
            Ask smarter questions. Get clearer answers.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/refund-cancellation">Refund & Cancellation</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {year} DoubtiQ. All rights reserved.</p>
          <p className="footer-note">
            For support: <a href="mailto:support@doubtiq.com">support@doubtiq.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


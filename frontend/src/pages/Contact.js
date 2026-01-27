import React from 'react';
import './StaticPages.css';

const Contact = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-card">
          <h1>Contact Us</h1>
          <p className="static-meta">
            Have a question, feedback, or partnership idea? We&apos;d love to hear from you.
          </p>

          <div className="contact-grid">
            <div className="contact-box">
              <h3>Support</h3>
              <p>Email us for account, billing, or doubt-related issues:</p>
              <p>
                <a href="mailto:support@doubtiq.com">support@doubtiq.com</a>
              </p>
            </div>

            <div className="contact-box">
              <h3>Business & Partnerships</h3>
              <p>For collaborations, campus programs, or partnerships:</p>
              <p>
                <a href="mailto:partners@doubtiq.com">partners@doubtiq.com</a>
              </p>
            </div>
          </div>

          <h2>Response Time</h2>
          <p>
            We usually respond within 24–48 hours on working days. For urgent platform issues, please mention
            &quot;URGENT&quot; in the subject line of your email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;


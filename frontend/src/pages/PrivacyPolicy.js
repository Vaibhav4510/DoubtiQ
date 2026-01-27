import React from 'react';
import './StaticPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-card">
          <h1>Privacy Policy</h1>
          <p className="static-meta">Last updated: January 2026</p>

          <p>
            This Privacy Policy explains how DoubtiQ (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects,
            uses, and protects your information when you use our platform.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Account information such as name, email, and password.</li>
            <li>Doubts you submit, including images, text, and related metadata.</li>
            <li>Usage data such as device information, IP address, and interaction logs.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve doubt-solving and tutoring services.</li>
            <li>To show relevant ads for free users (including Google AdSense).</li>
            <li>To maintain security, prevent fraud, and comply with legal requirements.</li>
          </ul>

          <h2>Third‑Party Services & Ads</h2>
          <p>
            We may display ads through providers such as Google AdSense. These partners may use cookies or similar
            technologies to show personalized ads based on your activity. You can manage ad personalization in your
            Google account or browser settings.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can request access, correction, or deletion of your account data by contacting us at{' '}
            <a href="mailto:support@doubtiq.com">support@doubtiq.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


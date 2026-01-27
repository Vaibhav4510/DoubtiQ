import React from 'react';
import './StaticPages.css';

const Terms = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-card">
          <h1>Terms & Conditions</h1>
          <p className="static-meta">Last updated: January 2026</p>

          <h2>Use of the Platform</h2>
          <p>
            By using DoubtiQ, you agree to use the platform only for lawful, educational purposes. You are responsible
            for the content you upload and must ensure it does not infringe any third‑party rights.
          </p>

          <h2>Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. Notify us immediately
            if you suspect unauthorized use of your account.
          </p>

          <h2>Content & Ownership</h2>
          <p>
            Doubts and solutions may be stored and reused in anonymized form to improve our service and provide better
            matches to other students.
          </p>

          <h2>Ads & Monetization</h2>
          <p>
            We may display ads (including Google AdSense / AdMob) to support the service. Using ad‑blocking tools may
            limit certain free features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;


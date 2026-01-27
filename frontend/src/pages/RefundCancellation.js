import React from 'react';
import './StaticPages.css';

const RefundCancellation = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-card">
          <h1>Refund & Cancellation Policy</h1>
          <p className="static-meta">Last updated: January 2026</p>

          <h2>Subscriptions</h2>
          <p>
            If you are subscribed to a premium plan, billing and refunds are handled as per the terms shown at the time
            of purchase. For any billing disputes, please contact{' '}
            <a href="mailto:support@doubtiq.com">support@doubtiq.com</a> within 7 days of the charge.
          </p>

          <h2>Cancellations</h2>
          <p>
            You can cancel your subscription at any time from your account or by contacting support. After
            cancellation, you will continue to have access to premium features until the end of the current billing
            period.
          </p>

          <h2>One‑time Payments</h2>
          <p>
            For one‑time purchases, refunds may be considered on a case‑by‑case basis in situations such as duplicate
            transactions or technical issues preventing access to the service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellation;


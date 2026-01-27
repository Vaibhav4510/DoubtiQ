import React, { useEffect } from 'react';
import './GoogleAd.css';

const GoogleAd = ({ slot, format = 'auto', layout = '', className = '' }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV !== 'test') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // fail silently if ads script not loaded
    }
  }, [slot]);

  return (
    <div className={`google-ad-wrapper ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.REACT_APP_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default GoogleAd;


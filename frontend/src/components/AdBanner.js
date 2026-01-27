import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdBanner.css';

const AdBanner = ({ position }) => {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // Only show ads to free users
    if (!user || user.subscription?.type === 'premium') {
      return;
    }

    const fetchAds = async () => {
      try {
        const res = await axios.get(`/api/ads?position=${position}`);
        setAds(res.data);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    fetchAds();
  }, [user, position]);

  const handleAdClick = async (adId) => {
    try {
      await axios.post(`/api/ads/${adId}/click`);
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  if (!user || user.subscription?.type === 'premium' || ads.length === 0) {
    return null;
  }

  return (
    <div className={`ad-banner ad-${position}`}>
      {ads.map((ad) => (
        <a
          key={ad._id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAdClick(ad._id)}
          className="ad-link"
        >
          <img src={ad.imageUrl} alt={ad.title} className="ad-image" />
        </a>
      ))}
    </div>
  );
};

export default AdBanner;

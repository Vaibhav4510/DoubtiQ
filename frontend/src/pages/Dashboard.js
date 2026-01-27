import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const res = await axios.get('/api/doubts/my-doubts');
      setDoubts(res.data);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending' },
      assigned: { class: 'badge-info', text: 'Assigned' },
      solved: { class: 'badge-success', text: 'Solved' },
      matched: { class: 'badge-success', text: 'Matched' }
    };
    return badges[status] || { class: 'badge-secondary', text: status };
  };

  const total = doubts.length;
  const solved = doubts.filter(d => d.status === 'solved' || d.status === 'matched').length;
  const pending = doubts.filter(d => d.status === 'pending' || d.status === 'assigned').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120 }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      className="dashboard-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AdBanner position="header" />
      <div className="container">
        <motion.div className="dashboard-header" variants={itemVariants}>
          <div>
            <h1>My Doubts Overview</h1>
            <p className="dashboard-subtitle">
              Quick snapshot of all doubts you have created across the platform.
            </p>
          </div>
          <Link to="/" className="btn-primary-link">
            Upload New Doubt
          </Link>
        </motion.div>

        <motion.div className="dashboard-stats" variants={itemVariants}>
          <div className="dashboard-stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total Doubts</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{solved}</div>
            <div className="stat-label">Solved / Matched</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-number">{pending}</div>
            <div className="stat-label">Pending / Assigned</div>
          </div>
        </motion.div>

        {doubts.length === 0 ? (
          <motion.div
            className="empty-state card"
            variants={itemVariants}
          >
            <p className="empty-title">No doubts yet</p>
            <p className="empty-subtitle">
              Start by uploading your first doubt from the home page.
            </p>
            <Link to="/" className="btn-primary-link">
              Upload Your First Doubt
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="doubts-list"
            variants={containerVariants}
          >
            {doubts.map((doubt, index) => {
              const badge = getStatusBadge(doubt.status);
              return (
                <motion.div
                  key={doubt._id}
                  className="doubt-card card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 260 }}
                >
                  <div className="doubt-header">
                    <h3>{doubt.title || 'Untitled Doubt'}</h3>
                    <span className={`badge ${badge.class}`}>{badge.text}</span>
                  </div>
                  <p className="doubt-content">
                    {doubt.content || doubt.extractedText || 'No content available'}
                  </p>
                  {doubt.imageUrl && (
                    <img src={doubt.imageUrl} alt="Doubt" className="doubt-image" />
                  )}
                  
                  {doubt.matchedSolution && (
                    <div className="solution-preview">
                      <h4>Matched Solution</h4>
                      {doubt.matchedSolution.type === 'video' && doubt.matchedSolution.youtubeVideoId ? (
                        <iframe
                          width="100%"
                          height="260"
                          src={`https://www.youtube.com/embed/${doubt.matchedSolution.youtubeVideoId}`}
                          title="Solution"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <p>{doubt.matchedSolution.content}</p>
                      )}
                    </div>
                  )}

                  {doubt.solution && (
                    <div className="solution-preview">
                      <h4>Tutor Solution</h4>
                      {doubt.solution.type === 'video' && doubt.solution.youtubeVideoId ? (
                        <iframe
                          width="100%"
                          height="260"
                          src={`https://www.youtube.com/embed/${doubt.solution.youtubeVideoId}`}
                          title="Solution"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div>
                          {doubt.solution.steps && doubt.solution.steps.length > 0 ? (
                            <ol>
                              {doubt.solution.steps.map((step, idx) => (
                                <li key={idx}>
                                  <strong>Step {step.stepNumber}:</strong> {step.description}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p>{doubt.solution.content}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {doubt.assignedTutor && (
                    <p className="assigned-tutor">
                      Assigned to: {doubt.assignedTutor.name}
                    </p>
                  )}
                  
                  <p className="doubt-date">
                    Submitted: {new Date(doubt.submittedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
      <AdBanner position="footer" />
    </motion.div>
  );
};

export default Dashboard;

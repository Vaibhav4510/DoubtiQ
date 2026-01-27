import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DoubtUploader from '../components/DoubtUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import AdBanner from '../components/AdBanner';
import './UserDashboard.css';

const UserDashboard = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState(null);
  const [matchedSolution, setMatchedSolution] = useState(null);
  const [matching, setMatching] = useState(false);
  const [stats, setStats] = useState({ total: 0, solved: 0, pending: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoubts();
  }, []);

  useEffect(() => {
    const solved = doubts.filter(d => d.status === 'solved' || d.status === 'matched').length;
    const pending = doubts.filter(d => d.status === 'pending' || d.status === 'verified' || d.status === 'assigned').length;
    setStats({ total: doubts.length, solved, pending });
  }, [doubts]);

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

  const handleDoubtUploaded = async (result) => {
    setUploading(false);
    setMatching(false);
    
    if (result.matched && result.solution) {
      setMatchedSolution(result.solution);
      setCurrentDoubt(result.doubt);
      await fetchDoubts();
    } else if (result.doubt) {
      setCurrentDoubt(result.doubt);
      setShowSubmitModal(true);
    } else {
      alert('Error processing doubt. Please try again.');
    }
  };

  const handleUploadStart = () => {
    setUploading(true);
    setMatching(true);
  };

  const handleSubmitToTutors = async () => {
    try {
      await axios.post(`/api/doubts/${currentDoubt._id}/submit`);
      setShowSubmitModal(false);
      setCurrentDoubt(null);
      await fetchDoubts();
    } catch (error) {
      console.error('Error submitting doubt:', error);
      alert('Error submitting doubt. Please try again.');
    }
  };

  const handleDeleteDoubt = async (doubtId) => {
    if (!window.confirm('Are you sure you want to delete this doubt? This will remove it from your dashboard.')) {
      return;
    }
    
    try {
      await axios.delete(`/api/doubts/${doubtId}`);
      alert('Doubt deleted successfully');
      await fetchDoubts();
    } catch (error) {
      console.error('Error deleting doubt:', error);
      alert('Error deleting doubt. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending Verification', icon: '⏳' },
      verified: { class: 'badge-info', text: 'Verified', icon: '✓' },
      assigned: { class: 'badge-primary', text: 'Assigned', icon: '👨‍🏫' },
      solved: { class: 'badge-success', text: 'Solved', icon: '✅' },
      matched: { class: 'badge-success', text: 'Matched', icon: '🎯' }
    };
    return badges[status] || { class: 'badge-secondary', text: status, icon: '' };
  };

  // Fallback: some old solutions may only have videoUrl (no youtubeVideoId)
  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      className="user-dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AdBanner position="header" />
      <div className="container">
        {/* Header Section */}
        <motion.div 
          className="dashboard-header"
          variants={itemVariants}
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            Welcome Back! 👋
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="header-subtitle"
          >
            Manage your doubts and get instant solutions
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="stats-container"
          variants={itemVariants}
        >
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">📚</div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Doubts</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.solved}</div>
            <div className="stat-label">Solved</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">⏳</div>
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          className="upload-section"
          variants={itemVariants}
        >
          <motion.div
            className="section-header"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>📤 Upload Your Doubt</h2>
            <p className="section-subtitle">Get instant solutions with AI-powered matching</p>
          </motion.div>
          
          {matching && (
            <motion.div 
              className="matching-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSpinner message="🔍 Matching your doubt with existing solutions..." />
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <DoubtUploader 
              onUpload={handleDoubtUploaded} 
              onUploadStart={handleUploadStart}
              disabled={uploading}
            />
          </motion.div>
        </motion.div>

        {/* Matched Solution */}
        <AnimatePresence>
          {matchedSolution && (
            <motion.div
              className="matched-solution card"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="solution-header">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <h2>🎉 Solution Found!</h2>
                  <p className="match-message">We found a matching solution for your doubt</p>
                </motion.div>
                <motion.button 
                  className="btn-close"
                  onClick={() => {
                    setMatchedSolution(null);
                    setCurrentDoubt(null);
                  }}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              {matchedSolution.type === 'video' && matchedSolution.youtubeVideoId ? (
                <motion.div
                  className="video-solution"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${matchedSolution.youtubeVideoId}`}
                    title="Solution Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              ) : matchedSolution ? (
                <motion.div
                  className="text-solution"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {matchedSolution.steps && matchedSolution.steps.length > 0 ? (
                    <ol className="steps-list">
                      {matchedSolution.steps.map((step, idx) => (
                        <motion.li 
                          key={idx}
                          className="step-item"
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
                          whileHover={{ x: 10, scale: 1.02 }}
                        >
                          <div className="step-number">{step.stepNumber}</div>
                          <div className="step-content">
                            <strong>Step {step.stepNumber}:</strong> {step.description}
                            {step.imageUrl && (
                              <img src={step.imageUrl} alt={`Step ${step.stepNumber}`} />
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  ) : (
                    <p className="solution-text">{matchedSolution.content || 'No solution content available'}</p>
                  )}
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doubts Section */}
        <motion.div
          className="doubts-section"
          variants={itemVariants}
        >
          <motion.div
            className="section-header"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2>📋 My Doubts</h2>
            <p className="section-subtitle">Track all your submitted doubts and their status</p>
          </motion.div>
          
          {doubts.length === 0 ? (
            <motion.div
              className="empty-state card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="empty-icon">📝</div>
              <p>You haven't submitted any doubts yet.</p>
              <p className="empty-hint">Upload your first doubt above to get started!</p>
            </motion.div>
          ) : (
            <motion.div
              className="doubts-list"
              variants={containerVariants}
            >
              {doubts.map((doubt, index) => {
                const badge = getStatusBadge(doubt.status);
                const previewText = (doubt.content || doubt.extractedText || 'No content available').slice(0, 180);
                return (
                  <motion.div
                    key={doubt._id}
                    className="doubt-card card"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/doubts/${doubt._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(`/doubts/${doubt._id}`);
                      }
                    }}
                    title="Click to view solutions"
                  >
                    {/** local per-card expanded state */}
                    {/** computed inline to avoid repeated includes calls */}
                    <div className="doubt-header">
                      <h3>{doubt.title || 'Untitled Doubt'}</h3>
                      <motion.span
                        className={`badge ${badge.class}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        {badge.icon} {badge.text}
                      </motion.span>
                    </div>

                    <div className="doubt-section">
                      <div className="doubt-section-header">
                        <span className="doubt-section-title">📝 Question</span>
                      </div>
                      <p className="doubt-content">
                        {previewText}
                        {(doubt.content || doubt.extractedText || '').length > 180 && '…'}
                      </p>
                    </div>
                    {doubt.assignedTutor && (
                      <p className="doubt-tutor-info">
                        <strong>👨‍🏫 Assigned to:</strong> {doubt.assignedTutor?.name || 'Tutor'}
                      </p>
                    )}
                    {doubt.imageUrl && (
                      <motion.img
                        src={doubt.imageUrl}
                        alt="Doubt"
                        className="doubt-image"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                      />
                    )}

                    <div className="doubt-footer">
                      <motion.p
                        className="doubt-date"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        📅 Submitted: {new Date(doubt.submittedAt).toLocaleDateString()}
                      </motion.p>
                      <div className="doubt-footer-actions">
                        {(doubt.matchedSolution || doubt.solution) && (
                          <motion.button
                            className="btn-primary btn-view-details"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/doubts/${doubt._id}`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            🔍 View Solution
                          </motion.button>
                        )}
                      <motion.button
                        className="btn-delete-doubt"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteDoubt(doubt._id);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="modal-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                ❓
              </motion.div>
              <h2>No Matching Solution Found</h2>
              <p>Would you like to submit this doubt to our expert tutors?</p>
              <div className="modal-actions">
                <motion.button
                  className="btn btn-primary"
                  onClick={handleSubmitToTutors}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Submit to Tutors
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdBanner position="footer" />
    </motion.div>
  );
};

export default UserDashboard;

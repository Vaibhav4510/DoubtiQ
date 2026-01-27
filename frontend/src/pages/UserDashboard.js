import React, { useState, useEffect, useCallback } from 'react';
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

  // -------------------- FETCH DOUBTS --------------------
  const fetchDoubts = useCallback(async () => {
    try {
      const res = await axios.get('/api/doubts/my-doubts');
      setDoubts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  // stats calculation
  useEffect(() => {
    const solved = doubts.filter(
      d => d.status === 'solved' || d.status === 'matched'
    ).length;

    const pending = doubts.filter(
      d =>
        d.status === 'pending' ||
        d.status === 'verified' ||
        d.status === 'assigned'
    ).length;

    setStats({ total: doubts.length, solved, pending });
  }, [doubts]);

  // -------------------- HANDLERS --------------------
  const handleDoubtUploaded = async (result) => {
    setUploading(false);
    setMatching(false);

    if (result?.matched && result.solution) {
      setMatchedSolution(result.solution);
      setCurrentDoubt(result.doubt);
      await fetchDoubts();
      return;
    }

    if (result?.doubt) {
      setCurrentDoubt(result.doubt);
      setShowSubmitModal(true);
      return;
    }

    alert('Error processing doubt. Please try again.');
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
    if (!window.confirm('Are you sure you want to delete this doubt?')) return;

    try {
      await axios.delete(`/api/doubts/${doubtId}`);
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

  // -------------------- ANIMATIONS --------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) return <LoadingSpinner />;

  // -------------------- UI --------------------
  return (
    <motion.div
      className="user-dashboard"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AdBanner position="header" />

      <div className="container">
        <motion.h1 variants={itemVariants}>Welcome Back 👋</motion.h1>

        {/* Stats */}
        <motion.div className="stats-container" variants={itemVariants}>
          <div className="stat-card">📚 {stats.total} Total</div>
          <div className="stat-card">✅ {stats.solved} Solved</div>
          <div className="stat-card">⏳ {stats.pending} Pending</div>
        </motion.div>

        {/* Upload */}
        <motion.div className="upload-section" variants={itemVariants}>
          {matching && <LoadingSpinner message="Matching your doubt..." />}
          <DoubtUploader
            onUpload={handleDoubtUploaded}
            onUploadStart={handleUploadStart}
            disabled={uploading}
          />
        </motion.div>

        {/* Doubts */}
        <motion.div className="doubts-section" variants={itemVariants}>
          {doubts.length === 0 ? (
            <p>No doubts submitted yet.</p>
          ) : (
            doubts.map(doubt => {
              const badge = getStatusBadge(doubt.status);
              return (
                <motion.div
                  key={doubt._id}
                  className="doubt-card"
                  variants={itemVariants}
                  onClick={() => navigate(`/doubts/${doubt._id}`)}
                >
                  <h3>{doubt.title || 'Untitled Doubt'}</h3>
                  <span className={`badge ${badge.class}`}>
                    {badge.icon} {badge.text}
                  </span>
                  <p>{(doubt.content || doubt.extractedText || '').slice(0, 150)}…</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDoubt(doubt._id);
                    }}
                  >
                    🗑 Delete
                  </button>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      <AdBanner position="footer" />

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
            <motion.div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>No matching solution found</h2>
              <p>Submit this doubt to tutors?</p>
              <button onClick={handleSubmitToTutors}>Submit</button>
              <button onClick={() => setShowSubmitModal(false)}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserDashboard;

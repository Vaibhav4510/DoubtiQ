import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import DoubtUploader from '../components/DoubtUploader';
import AdBanner from '../components/AdBanner';
import GoogleAd from '../components/GoogleAd';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState(null);
  const [matchedSolution, setMatchedSolution] = useState(null);

  const handleDoubtUploaded = async (result) => {
    if (result.matched && result.solution) {
      setMatchedSolution(result.solution);
      setCurrentDoubt(result.doubt);
    } else {
      setCurrentDoubt(result.doubt);
      setShowSubmitModal(true);
    }
  };

  const handleSubmitToTutors = async () => {
    try {
      await axios.post(`/api/doubts/${currentDoubt._id}/submit`);
      setShowSubmitModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting doubt:', error);
      alert('Error submitting doubt. Please try again.');
    }
  };

  if (!user) {
    return (
      <motion.div
        className="home-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              Welcome to <span className="brand-gradient">DoubtiQ</span>
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Get instant solutions to your academic doubts
            </motion.p>
            <motion.p
              className="hero-description"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Upload images or type your questions. Our AI-powered system matches your doubts with existing solutions or connects you with expert tutors.
            </motion.p>
            
            <motion.div
              className="hero-features"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="feature-card"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">⚡</div>
                <h3>Instant Matching</h3>
                <p>AI-powered OCR and text matching</p>
              </motion.div>
              <motion.div
                className="feature-card"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">👨‍🏫</div>
                <h3>Expert Tutors</h3>
                <p>Get help from verified educators</p>
              </motion.div>
              <motion.div
                className="feature-card"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">📹</div>
                <h3>Video Solutions</h3>
                <p>Step-by-step video explanations</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/register">
                <motion.button
                  className="btn btn-primary btn-hero"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="btn btn-secondary btn-hero"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>

            <motion.section
              className="how-it-works"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h2>How DoubtiQ Works</h2>
              <p className="how-subtitle">A simple, three-step flow designed for fast, clear answers.</p>
              <div className="how-steps">
                <div className="how-step">
                  <div className="step-badge">1</div>
                  <h3>Upload Your Doubt</h3>
                  <p>Take a photo of your question or type it in. Our OCR reads even handwritten problems.</p>
                </div>
                <div className="how-step">
                  <div className="step-badge">2</div>
                  <h3>Instant AI Matching</h3>
                  <p>We immediately search for existing video or text solutions that match your doubt.</p>
                </div>
                <div className="how-step">
                  <div className="step-badge">3</div>
                  <h3>Ask Expert Tutors</h3>
                  <p>If no match is found, your doubt goes to verified tutors for a personalised solution.</p>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdBanner position="header" />
      {/* Google AdSense banner (set REACT_APP_ADSENSE_CLIENT and slot id) */}
      <GoogleAd slot={process.env.REACT_APP_ADSENSE_HOME_TOP_SLOT || '0'} />
      <div className="container">
        <motion.div
          className="home-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="home-header"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <h1>📚 Upload Your Doubt</h1>
            <p>Upload an image or type your doubt to get instant solutions</p>
          </motion.div>
          
          <DoubtUploader onUpload={handleDoubtUploaded} />

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
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    ✅ Solution Found!
                  </motion.h2>
                  <motion.button
                    className="btn-close"
                    onClick={() => setMatchedSolution(null)}
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
                ) : (
                  <motion.div
                    className="text-solution"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {matchedSolution.steps && matchedSolution.steps.length > 0 ? (
                      <ol>
                        {matchedSolution.steps.map((step, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <strong>Step {step.stepNumber}:</strong> {step.description}
                            {step.imageUrl && (
                              <img src={step.imageUrl} alt={`Step ${step.stepNumber}`} />
                            )}
                          </motion.li>
                        ))}
                      </ol>
                    ) : (
                      <p>{matchedSolution.content}</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
                  <h2>🔍 No Matching Solution Found</h2>
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
        </motion.div>
      </div>
      <AdBanner position="footer" />
      <GoogleAd slot={process.env.REACT_APP_ADSENSE_HOME_BOTTOM_SLOT || '0'} />
    </motion.div>
  );
};

export default Home;

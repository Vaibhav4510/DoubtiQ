import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './TutorPanel.css';

const TutorPanel = () => {
  const [doubts, setDoubts] = useState([]);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [steps, setSteps] = useState([{ stepNumber: 1, description: '' }]);
  const [loading, setLoading] = useState(true);
  const [editingSolution, setEditingSolution] = useState(null);
  const [editForm, setEditForm] = useState({ type: 'text', content: '', videoUrl: '', steps: [] });
  const [tutorStats, setTutorStats] = useState(null);

  useEffect(() => {
    fetchDoubts();
    fetchTutorStats();
  }, []);

  const fetchTutorStats = async () => {
    try {
      const res = await axios.get('/api/tutors/profile');
      setTutorStats(res.data);
    } catch (error) {
      console.error('Error fetching tutor stats:', error);
    }
  };

  const fetchDoubts = async () => {
    try {
      const res = await axios.get('/api/tutors/my-assignments');
      setDoubts(res.data);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, description: '' }]);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].description = value;
    setSteps(newSteps);
  };

  const handleSubmitSolution = async () => {
    if (!selectedDoubt) return;

    const hasContent = !!content.trim();
    const cleanedSteps = steps
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
      .filter(s => (s.description || '').trim());
    const hasSteps = cleanedSteps.length > 0;
    const hasVideo = !!videoUrl.trim();

    if (!hasContent && !hasSteps && !hasVideo) {
      alert('Please provide step-by-step solution, written explanation, or a YouTube video URL');
      return;
    }

    try {
      await axios.post('/api/solutions', {
        doubtId: selectedDoubt,
        // Let backend decide 'text'/'video'/'mixed' automatically
        content: hasContent ? content : undefined,
        steps: hasSteps ? cleanedSteps : undefined,
        videoUrl: hasVideo ? videoUrl : undefined
      });

      alert('Solution submitted successfully!');
      setSelectedDoubt(null);
      setContent('');
      setVideoUrl('');
      setSteps([{ stepNumber: 1, description: '' }]);
      fetchDoubts();
      fetchTutorStats();
    } catch (error) {
      alert('Error submitting solution');
      console.error(error);
    }
  };

  const handleEditSolution = async (solutionId) => {
    try {
      const cleanedSteps = (editForm.steps || [])
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
        .filter(s => (s.description || '').trim());

      await axios.put(`/api/solutions/${solutionId}`, {
        content: editForm.content,
        steps: cleanedSteps,
        videoUrl: editForm.videoUrl,
      });
      alert('Solution updated successfully!');
      setEditingSolution(null);
      setEditForm({ type: 'text', content: '', videoUrl: '', steps: [] });
      fetchDoubts();
      fetchTutorStats();
    } catch (error) {
      alert('Error updating solution');
      console.error(error);
    }
  };

  const startEdit = (doubt) => {
    if (doubt.solution) {
      setSelectedDoubt(doubt._id);
      setEditingSolution(doubt.solution._id);
      setEditForm({
        type: doubt.solution.type || 'text',
        content: doubt.solution.content || '',
        videoUrl: doubt.solution.videoUrl || '',
        steps: doubt.solution.steps || []
      });
    }
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

  const assignedCount = doubts.length;
  const solvedCount = doubts.filter(d => d.status === 'solved').length;
  const pendingCount = doubts.filter(d => d.status === 'assigned').length;

  return (
    <motion.div
      className="tutor-panel"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <motion.div
          className="tutor-header"
          variants={itemVariants}
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            👨‍🏫 Tutor Dashboard
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="header-subtitle"
          >
            Manage your assigned doubts and help students learn
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
            <div className="stat-icon">📋</div>
            <div className="stat-number">{assignedCount}</div>
            <div className="stat-label">Assigned Doubts</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-number">{solvedCount}</div>
            <div className="stat-label">Solved</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-icon">⏳</div>
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </motion.div>
          {tutorStats && (
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="stat-icon">👁️</div>
              <div className="stat-number">{tutorStats.totalViews || 0}</div>
              <div className="stat-label">Total Views</div>
            </motion.div>
          )}
        </motion.div>

        <div className="tutor-content">
          <motion.div
            className="doubts-section"
            variants={itemVariants}
          >
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              📋 Assigned Doubts
            </motion.h2>
            {doubts.length === 0 ? (
              <motion.div
                className="empty-state card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <div className="empty-icon">📚</div>
                <p>No doubts assigned yet.</p>
                <p className="empty-hint">Wait for admin to assign doubts to you</p>
              </motion.div>
            ) : (
              <motion.div
                className="doubts-list"
                variants={containerVariants}
              >
                {doubts.map((doubt, index) => (
                  <motion.div
                    key={doubt._id}
                    className={`doubt-item card ${selectedDoubt === doubt._id ? 'selected' : ''}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => {
                      setSelectedDoubt(doubt._id);
                      setEditingSolution(null);
                    }}
                  >
                    <div className="doubt-item-header">
                      <h3>{doubt.title}</h3>
                      {doubt.solution && (
                        <motion.span
                          className="solution-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          ✅ Solved
                        </motion.span>
                      )}
                    </div>
                    <p className="doubt-content">{doubt.content}</p>
                    {doubt.imageUrl && (
                      <motion.img
                        src={doubt.imageUrl}
                        alt="Doubt"
                        className="doubt-thumbnail"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      />
                    )}
                    <div className="doubt-meta-info">
                      <p className="doubt-status">
                        <span className="meta-label">Status:</span> {doubt.status}
                      </p>
                      <p className="doubt-user">
                        <span className="meta-label">From:</span> {doubt.user?.name}
                      </p>
                      <p className="doubt-date">
                        <span className="meta-label">Date:</span> {new Date(doubt.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {selectedDoubt && (
              <motion.div
                className="solution-section card"
                initial={{ scale: 0.9, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="solution-header">
                  <motion.h2
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {editingSolution ? '✏️ Edit Solution' : '✍️ Submit Solution'}
                  </motion.h2>
                  <motion.button
                    className="btn-close"
                    onClick={() => {
                      setSelectedDoubt(null);
                      setEditingSolution(null);
                      setContent('');
                      setVideoUrl('');
                      setSteps([{ stepNumber: 1, description: '' }]);
                    }}
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>
                
                {editingSolution ? (
                  <motion.div
                    className="edit-solution-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="form-group">
                      <label>Edit Solution (Steps + Video supported)</label>
                    </div>

                    <div className="form-group">
                      <label>Written Explanation (optional)</label>
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows="5"
                        placeholder="Enter solution..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Step-by-Step (optional)</label>
                      {(editForm.steps || []).map((step, index) => (
                        <div key={index} className="step-input">
                          <label>Step {index + 1}:</label>
                          <textarea
                            value={step.description || ''}
                            onChange={(e) => {
                              const next = [...(editForm.steps || [])];
                              next[index] = { ...next[index], stepNumber: index + 1, description: e.target.value };
                              setEditForm({ ...editForm, steps: next });
                            }}
                            rows="2"
                            placeholder="Enter step description..."
                          />
                        </div>
                      ))}
                      <motion.button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          const next = [...(editForm.steps || [])];
                          next.push({ stepNumber: next.length + 1, description: '' });
                          setEditForm({ ...editForm, steps: next });
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ➕ Add Step
                      </motion.button>
                    </div>

                    <div className="form-group">
                      <label>YouTube Video URL (optional)</label>
                      <input
                        type="url"
                        value={editForm.videoUrl}
                        onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div className="form-actions">
                      <motion.button
                        className="btn btn-primary"
                        onClick={() => handleEditSolution(editingSolution)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Update Solution
                      </motion.button>
                      <motion.button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingSolution(null);
                          setEditForm({ type: 'text', content: '', videoUrl: '', steps: [] });
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="form-group">
                      <label>Submit Solution (Step-by-step + Video supported)</label>
                    </div>

                    <div className="form-group">
                      <label>Written Explanation (optional)</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        placeholder="Explain the solution... (optional if you provide steps/video)"
                      />
                    </div>

                    <div className="form-group">
                      <label>Step-by-Step Solution (optional)</label>
                      {steps.map((step, index) => (
                        <motion.div
                          key={index}
                          className="step-input"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                        >
                          <label>Step {index + 1}:</label>
                          <textarea
                            value={step.description}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            rows="2"
                            placeholder="Enter step description..."
                          />
                        </motion.div>
                      ))}
                      <motion.button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddStep}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ➕ Add Step
                      </motion.button>
                    </div>

                    <div className="form-group">
                      <label>YouTube Video URL (optional)</label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="form-hint">💡 You can submit both steps + video for the same doubt.</p>
                    </div>

                    <div className="form-actions">
                      <motion.button
                        className="btn btn-primary"
                        onClick={handleSubmitSolution}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✅ Submit Solution
                      </motion.button>
                      {doubts.find(d => d._id === selectedDoubt)?.solution && (
                        <motion.button
                          className="btn btn-secondary"
                          onClick={() => startEdit(doubts.find(d => d._id === selectedDoubt))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✏️ Edit Solution
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorPanel;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminPanel.css';

const AdminPanel = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  
  // Filter States
  const [doubtFilter, setDoubtFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action States
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adForm, setAdForm] = useState({ 
    title: '', 
    imageUrl: '', 
    link: '', 
    position: 'header', 
    isActive: true 
  });

  // Detail Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Fetch Data on Tab Change
  useEffect(() => {
    fetchData();
    if (activeTab === 'doubts' || activeTab === 'tutors') {
      fetchTutors();
    }
  }, [activeTab, doubtFilter]);

  // Fetch Tutors for Assignment
  const fetchTutors = async () => {
    try {
      const res = await axios.get('/api/admin/tutors');
      setTutors(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setTutors([]);
    }
  };

  // Main Data Fetching Function
  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'stats':
          const statsRes = await axios.get('/api/admin/stats');
          setStats(statsRes.data);
          break;
        case 'doubts':
          const doubtUrl = doubtFilter === 'all' 
            ? '/api/admin/doubts' 
            : `/api/admin/doubts?status=${doubtFilter}`;
          const doubtsRes = await axios.get(doubtUrl);
          setDoubts(Array.isArray(doubtsRes.data) ? doubtsRes.data : []);
          break;
        case 'tutors':
          const tutorsRes = await axios.get('/api/admin/tutors');
          setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);
          break;
        case 'users':
          const usersRes = await axios.get('/api/admin/users');
          setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
          break;
        case 'ads':
          const adsRes = await axios.get('/api/ads/all');
          setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to fetch data'}`);
      }
      // Set empty arrays on error
      if (activeTab === 'doubts') setDoubts([]);
      else if (activeTab === 'tutors') setTutors([]);
      else if (activeTab === 'users') setUsers([]);
      else if (activeTab === 'ads') setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // Doubt Actions
  const handleVerifyDoubt = async (doubtId) => {
    try {
      await axios.put(`/api/admin/doubts/${doubtId}/verify`);
      alert('✅ Doubt verified successfully!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error verifying doubt');
    }
  };

  const handleAssignDoubt = async () => {
    if (!selectedDoubt || !selectedTutorId) {
      alert('⚠️ Please select both a doubt and a tutor');
      return;
    }
    try {
      await axios.put(`/api/admin/doubts/${selectedDoubt}/assign`, {
        tutorId: selectedTutorId
      });
      alert('✅ Doubt assigned successfully!');
      setSelectedDoubt(null);
      setSelectedTutorId('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error assigning doubt');
    }
  };

  const handleEditDoubt = async (doubtId) => {
    if (!editForm.title || !editForm.content) {
      alert('⚠️ Please fill in both title and content');
      return;
    }
    try {
      await axios.put(`/api/admin/doubts/${doubtId}`, editForm);
      alert('✅ Doubt updated successfully!');
      setEditingDoubt(null);
      setEditForm({ title: '', content: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error updating doubt');
    }
  };

  const handleDeleteDoubt = async (doubtId) => {
    if (!window.confirm('⚠️ Permanently delete this doubt? This cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`/api/admin/doubts/${doubtId}`);
      alert('✅ Doubt deleted permanently!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error deleting doubt');
    }
  };

  const startEditDoubt = (doubt) => {
    setEditingDoubt(doubt._id);
    setEditForm({ 
      title: doubt.title, 
      content: doubt.content || doubt.extractedText || '' 
    });
  };

  // Tutor Actions
  const handleVerifyTutor = async (tutorId) => {
    try {
      await axios.put(`/api/admin/tutors/${tutorId}/verify`);
      alert('✅ Tutor verified and activated!');
      fetchData();
      fetchTutors();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error verifying tutor');
    }
  };

  const handleToggleTutorStatus = async (tutorId, isActive) => {
    try {
      await axios.put(`/api/admin/tutors/${tutorId}/status`, { isActive: !isActive });
      alert(`✅ Tutor ${!isActive ? 'activated' : 'deactivated'}!`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error updating tutor status');
    }
  };

  const handleDeleteTutor = async (tutorId) => {
    if (!window.confirm('⚠️ Permanently delete this tutor? This cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`/api/admin/tutors/${tutorId}`);
      alert('✅ Tutor deleted permanently!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error deleting tutor');
    }
  };

  // User Actions
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ Permanently delete this user and all their data? This cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      alert('✅ User deleted permanently!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error deleting user');
    }
  };

  // Ad Actions
  const handleCreateAd = async () => {
    if (!adForm.title || !adForm.imageUrl || !adForm.link) {
      alert('⚠️ Please fill all required fields');
      return;
    }
    try {
      await axios.post('/api/ads', adForm);
      alert('✅ Ad created successfully!');
      setShowAdForm(false);
      setAdForm({ title: '', imageUrl: '', link: '', position: 'header', isActive: true });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error creating ad');
    }
  };

  const handleEditAd = async () => {
    if (!adForm.title || !adForm.imageUrl || !adForm.link) {
      alert('⚠️ Please fill all required fields');
      return;
    }
    try {
      await axios.put(`/api/ads/${editingAd}`, adForm);
      alert('✅ Ad updated successfully!');
      setEditingAd(null);
      setShowAdForm(false);
      setAdForm({ title: '', imageUrl: '', link: '', position: 'header', isActive: true });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error updating ad');
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('⚠️ Delete this ad?')) {
      return;
    }
    try {
      await axios.delete(`/api/ads/${adId}`);
      alert('✅ Ad deleted successfully!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error deleting ad');
    }
  };

  const handleToggleAdStatus = async (adId, isActive) => {
    try {
      await axios.put(`/api/ads/${adId}`, { isActive: !isActive });
      alert('✅ Ad status updated!');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || '❌ Error updating ad');
    }
  };

  const startEditAd = (ad) => {
    setEditingAd(ad._id);
    setAdForm({
      title: ad.title,
      imageUrl: ad.imageUrl,
      link: ad.link,
      position: ad.position,
      isActive: ad.isActive
    });
    setShowAdForm(true);
  };

  // Filter Functions
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter(tutor =>
    tutor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoubts = doubts.filter(doubt =>
    doubt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doubt.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9 }
  };

  const tabs = [
    { id: 'stats', label: '📊 Statistics', icon: '📊' },
    { id: 'doubts', label: '❓ Doubts', icon: '❓' },
    { id: 'tutors', label: '👨‍🏫 Tutors', icon: '👨‍🏫' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'ads', label: '📢 Ads', icon: '📢' }
  ];

  return (
    <motion.div 
      className="admin-panel"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          👑 Admin Control Panel
        </motion.h1>
        
        <motion.p
          className="admin-subtitle"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage doubts, tutors, users, and platform settings
        </motion.p>

        {/* Tabs */}
        <motion.div className="admin-tabs">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Search Bar */}
        {(activeTab === 'users' || activeTab === 'tutors' || activeTab === 'doubts') && (
          <motion.div
            className="search-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </motion.div>
        )}

        {/* Content Area */}
        <motion.div
          className="admin-content"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Statistics Tab */}
              {activeTab === 'stats' && stats && (
                <motion.div className="stats-grid" variants={containerVariants}>
                  {Object.entries(stats).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      className="stat-card"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="stat-icon">
                        {key.includes('User') && '👥'}
                        {key.includes('Tutor') && '👨‍🏫'}
                        {key.includes('Doubt') && '❓'}
                        {key.includes('Solution') && '✅'}
                        {key.includes('Premium') && '⭐'}
                        {!key.includes('User') && !key.includes('Tutor') && !key.includes('Doubt') && !key.includes('Solution') && !key.includes('Premium') && '📊'}
                      </div>
                      <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <motion.p
                        className="stat-number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                      >
                        {value}
                      </motion.p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Doubts Tab */}
              {activeTab === 'doubts' && (
                <div className="doubts-section">
                  <div className="doubts-filters">
                    {['all', 'pending', 'verified', 'assigned', 'solved'].map(status => (
                      <motion.button
                        key={status}
                        className={`filter-btn ${doubtFilter === status ? 'active' : ''}`}
                        onClick={() => setDoubtFilter(status)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </motion.button>
                    ))}
                  </div>

                  {filteredDoubts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">❓</div>
                      <p>No doubts found</p>
                    </div>
                  ) : (
                    <motion.div className="doubts-grid" variants={containerVariants}>
                      {filteredDoubts.map((doubt, index) => (
                        <motion.div
                          key={doubt._id}
                          className="doubt-card"
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="card-header">
                            <h3>{doubt.title}</h3>
                            <span className={`status-badge status-${doubt.status}`}>
                              {doubt.status}
                            </span>
                          </div>
                          
                          <p className="doubt-content">{doubt.content || doubt.extractedText || 'No content'}</p>
                          
                          {doubt.imageUrl && (
                            <img src={doubt.imageUrl} alt="Doubt" className="doubt-image" />
                          )}

                          <div className="doubt-meta">
                            <p><strong>👤 User:</strong> {doubt.user?.name} ({doubt.user?.email})</p>
                            <p><strong>📅 Submitted:</strong> {new Date(doubt.submittedAt).toLocaleDateString()}</p>
                            {doubt.assignedTutor && (
                              <p><strong>👨‍🏫 Tutor:</strong> {doubt.assignedTutor?.name}</p>
                            )}
                            <p><strong>✓ Verified:</strong> {doubt.isVerified ? 'Yes' : 'No'}</p>
                          </div>

                          <div className="card-actions">
                            {!doubt.isVerified && doubt.status === 'pending' && (
                              <button
                                className="btn btn-success"
                                onClick={() => handleVerifyDoubt(doubt._id)}
                              >
                                ✓ Verify
                              </button>
                            )}

                            {doubt.isVerified && doubt.status === 'verified' && (
                              <div className="assign-section">
                                <select
                                  value={selectedDoubt === doubt._id ? selectedTutorId : ''}
                                  onChange={(e) => {
                                    setSelectedDoubt(doubt._id);
                                    setSelectedTutorId(e.target.value);
                                  }}
                                >
                                  <option value="">Select Tutor</option>
                                  {tutors.filter(t => t.isVerified && t.isActive).map(tutor => (
                                    <option key={tutor._id} value={tutor.user?._id || tutor.user}>
                                      {tutor.user?.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-primary"
                                  onClick={handleAssignDoubt}
                                  disabled={selectedDoubt !== doubt._id || !selectedTutorId}
                                >
                                  Assign
                                </button>
                              </div>
                            )}

                            {editingDoubt === doubt._id ? (
                              <div className="edit-form">
                                <input
                                  type="text"
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                  placeholder="Title"
                                />
                                <textarea
                                  value={editForm.content}
                                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                                  placeholder="Content"
                                />
                                <div className="form-actions">
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => handleEditDoubt(doubt._id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      setEditingDoubt(null);
                                      setEditForm({ title: '', content: '' });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="action-buttons">
                                <button
                                  className="btn btn-secondary"
                                  onClick={() => startEditDoubt(doubt)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteDoubt(doubt._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Tutors Tab */}
              {activeTab === 'tutors' && (
                <div className="tutors-section">
                  {filteredTutors.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">👨‍🏫</div>
                      <p>No tutors found</p>
                    </div>
                  ) : (
                    <motion.div className="tutors-grid" variants={containerVariants}>
                      {filteredTutors.map((tutor, index) => (
                        <motion.div
                          key={tutor._id}
                          className="tutor-card"
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="card-header">
                            <h3>{tutor.user?.name || 'Unknown'}</h3>
                            <div className="badges">
                              <span className={`badge ${tutor.isVerified ? 'badge-success' : 'badge-warning'}`}>
                                {tutor.isVerified ? '✓ Verified' : '⏳ Unverified'}
                              </span>
                              <span className={`badge ${tutor.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {tutor.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          <div className="tutor-info">
                            <p><strong>📧 Email:</strong> {tutor.user?.email || 'N/A'}</p>
                            <p><strong>📚 Solutions:</strong> {tutor.totalSolutions || 0}</p>
                            <p><strong>👁️ Views:</strong> {tutor.totalViews || 0}</p>
                            <p><strong>💰 Earnings:</strong> ${((tutor.totalViews || 0) * 0.01).toFixed(2)}</p>
                            <p><strong>📋 Assigned Doubts:</strong> {tutor.assignedDoubts || 0}</p>
                          </div>

                          <div className="card-actions">
                            <button
                              className="btn btn-info"
                              onClick={() => setSelectedTutor(tutor)}
                            >
                              👁️ View Details
                            </button>
                            {!tutor.isVerified && (
                              <button
                                className="btn btn-success"
                                onClick={() => handleVerifyTutor(tutor._id)}
                              >
                                ✓ Verify Tutor
                              </button>
                            )}
                            <button
                              className={`btn ${tutor.isActive ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleToggleTutorStatus(tutor._id, tutor.isActive)}
                            >
                              {tutor.isActive ? '⛔ Deactivate' : '✅ Activate'}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteTutor(tutor._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="users-section">
                  {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">👥</div>
                      <p>No users found</p>
                    </div>
                  ) : (
                    <motion.div className="users-grid" variants={containerVariants}>
                      {filteredUsers.map((user, index) => (
                        <motion.div
                          key={user._id}
                          className="user-card"
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="card-header">
                            <h3>{user.name}</h3>
                            <span className={`badge ${user.subscription?.type === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                              {user.subscription?.type === 'premium' ? '⭐ Premium' : '🆓 Free'}
                            </span>
                          </div>

                          <div className="user-info">
                            <p><strong>📧 Email:</strong> {user.email}</p>
                            <p><strong>📅 Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p><strong>✅ Subscription:</strong> {user.subscription?.isActive ? 'Active' : 'Inactive'}</p>
                            <p><strong>📊 Total Doubts:</strong> {user.totalDoubts || 0}</p>
                            <p><strong>👤 Role:</strong> {user.role}</p>
                          </div>

                          <div className="card-actions">
                            <button
                              className="btn btn-info"
                              onClick={() => setSelectedUser(user)}
                            >
                              👁️ View Details
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              🗑️ Delete User
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Ads Tab */}
              {activeTab === 'ads' && (
                <div className="ads-section">
                  <button
                    className="btn btn-primary add-btn"
                    onClick={() => {
                      setShowAdForm(true);
                      setEditingAd(null);
                      setAdForm({ title: '', imageUrl: '', link: '', position: 'header', isActive: true });
                    }}
                  >
                    ➕ Add New Ad
                  </button>

                  <AnimatePresence>
                    {showAdForm && (
                      <motion.div
                        className="ad-form-card"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="form-header">
                          <h3>{editingAd ? '✏️ Edit Ad' : '➕ Create Ad'}</h3>
                          <button className="close-btn" onClick={() => {
                            setShowAdForm(false);
                            setEditingAd(null);
                            setAdForm({ title: '', imageUrl: '', link: '', position: 'header', isActive: true });
                          }}>×</button>
                        </div>
                        <div className="form-group">
                          <label>Title *</label>
                          <input
                            type="text"
                            value={adForm.title}
                            onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                            placeholder="Ad title"
                          />
                        </div>
                        <div className="form-group">
                          <label>Image URL *</label>
                          <input
                            type="url"
                            value={adForm.imageUrl}
                            onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="form-group">
                          <label>Link URL *</label>
                          <input
                            type="url"
                            value={adForm.link}
                            onChange={(e) => setAdForm({...adForm, link: e.target.value})}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="form-group">
                          <label>Position *</label>
                          <select
                            value={adForm.position}
                            onChange={(e) => setAdForm({...adForm, position: e.target.value})}
                          >
                            <option value="header">Header</option>
                            <option value="sidebar">Sidebar</option>
                            <option value="footer">Footer</option>
                            <option value="youtube">YouTube</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={adForm.isActive}
                              onChange={(e) => setAdForm({...adForm, isActive: e.target.checked})}
                            />
                            Active
                          </label>
                        </div>
                        <div className="form-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => editingAd ? handleEditAd() : handleCreateAd()}
                          >
                            {editingAd ? '💾 Update' : '✅ Create'}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowAdForm(false);
                              setEditingAd(null);
                              setAdForm({ title: '', imageUrl: '', link: '', position: 'header', isActive: true });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {ads.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📢</div>
                      <p>No ads found</p>
                    </div>
                  ) : (
                    <motion.div className="ads-grid" variants={containerVariants}>
                      {ads.map((ad, index) => (
                        <motion.div
                          key={ad._id}
                          className="ad-card"
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <div className="card-header">
                            <h3>{ad.title}</h3>
                            <span className={`badge ${ad.isActive ? 'badge-success' : 'badge-danger'}`}>
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {ad.imageUrl && (
                            <img src={ad.imageUrl} alt={ad.title} className="ad-image" />
                          )}

                          <div className="ad-info">
                            <p><strong>📍 Position:</strong> {ad.position}</p>
                            <p><strong>🔗 Link:</strong> <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a></p>
                            <p><strong>👆 Clicks:</strong> {ad.clicks || 0}</p>
                            <p><strong>👁️ Impressions:</strong> {ad.impressions || 0}</p>
                            <p><strong>📊 CTR:</strong> {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%</p>
                          </div>

                          <div className="card-actions">
                            <button
                              className="btn btn-secondary"
                              onClick={() => startEditAd(ad)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className={`btn ${ad.isActive ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleToggleAdStatus(ad._id, ad.isActive)}
                            >
                              {ad.isActive ? '⛔ Deactivate' : '✅ Activate'}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteAd(ad._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="detail-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>👤 User Details</h2>
                <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{selectedUser.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role</span>
                    <span className="detail-value">{selectedUser.role}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Created</span>
                    <span className="detail-value">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subscription Type</span>
                    <span className={`detail-value badge ${selectedUser.subscription?.type === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                      {selectedUser.subscription?.type === 'premium' ? '⭐ Premium' : '🆓 Free'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subscription Status</span>
                    <span className={`detail-value badge ${selectedUser.subscription?.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {selectedUser.subscription?.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Doubts</span>
                    <span className="detail-value">{selectedUser.totalDoubts || 0}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => {
                  handleDeleteUser(selectedUser._id);
                  setSelectedUser(null);
                }}>
                  🗑️ Delete User
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutor Detail Modal */}
      <AnimatePresence>
        {selectedTutor && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTutor(null)}
          >
            <motion.div
              className="detail-modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>👨‍🏫 Tutor Details</h2>
                <button className="close-btn" onClick={() => setSelectedTutor(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{selectedTutor.user?.name || 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{selectedTutor.user?.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Verification Status</span>
                    <span className={`detail-value badge ${selectedTutor.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {selectedTutor.isVerified ? '✅ Verified' : '⏳ Unverified'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Status</span>
                    <span className={`detail-value badge ${selectedTutor.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {selectedTutor.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Solutions</span>
                    <span className="detail-value">{selectedTutor.totalSolutions || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Views</span>
                    <span className="detail-value">{selectedTutor.totalViews || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Earnings</span>
                    <span className="detail-value">${((selectedTutor.totalViews || 0) * 0.01).toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assigned Doubts</span>
                    <span className="detail-value">{selectedTutor.assignedDoubts || 0}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {!selectedTutor.isVerified && (
                  <button className="btn btn-success" onClick={() => {
                    handleVerifyTutor(selectedTutor._id);
                    setSelectedTutor(null);
                  }}>
                    ✓ Verify Tutor
                  </button>
                )}
                <button className={`btn ${selectedTutor.isActive ? 'btn-warning' : 'btn-success'}`} onClick={() => {
                  handleToggleTutorStatus(selectedTutor._id, selectedTutor.isActive);
                  setSelectedTutor(null);
                }}>
                  {selectedTutor.isActive ? '⛔ Deactivate' : '✅ Activate'}
                </button>
                <button className="btn btn-danger" onClick={() => {
                  handleDeleteTutor(selectedTutor._id);
                  setSelectedTutor(null);
                }}>
                  🗑️ Delete Tutor
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedTutor(null)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;

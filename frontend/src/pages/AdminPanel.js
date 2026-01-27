import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminPanel.css';

const AdminPanel = () => {
  // -------------------- STATE --------------------
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [doubts, setDoubts] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);

  const [doubtFilter, setDoubtFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // -------------------- FETCH TUTORS --------------------
  const fetchTutors = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/tutors');
      setTutors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setTutors([]);
    }
  }, []);

  // -------------------- FETCH DATA --------------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'stats': {
          const res = await axios.get('/api/admin/stats');
          setStats(res.data);
          break;
        }
        case 'doubts': {
          const url =
            doubtFilter === 'all'
              ? '/api/admin/doubts'
              : `/api/admin/doubts?status=${doubtFilter}`;
          const res = await axios.get(url);
          setDoubts(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'tutors': {
          const res = await axios.get('/api/admin/tutors');
          setTutors(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'users': {
          const res = await axios.get('/api/admin/users');
          setUsers(Array.isArray(res.data) ? res.data : []);
          break;
        }
        case 'ads': {
          const res = await axios.get('/api/ads/all');
          setAds(Array.isArray(res.data) ? res.data : []);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      if (activeTab === 'doubts') setDoubts([]);
      if (activeTab === 'tutors') setTutors([]);
      if (activeTab === 'users') setUsers([]);
      if (activeTab === 'ads') setAds([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, doubtFilter]);

  // -------------------- EFFECT --------------------
  useEffect(() => {
    fetchData();
    if (activeTab === 'doubts' || activeTab === 'tutors') {
      fetchTutors();
    }
  }, [activeTab, doubtFilter, fetchData, fetchTutors]);

  // -------------------- FILTERS --------------------
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTutors = tutors.filter(t =>
    t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoubts = doubts.filter(d =>
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------- UI --------------------
  return (
    <motion.div className="admin-panel">
      <h1>👑 Admin Control Panel</h1>

      <div className="tabs">
        {['stats', 'doubts', 'tutors', 'users', 'ads'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {(activeTab === 'users' || activeTab === 'tutors' || activeTab === 'doubts') && (
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <pre>{JSON.stringify(stats, null, 2)}</pre>
          )}

          {activeTab === 'doubts' && (
            <div>
              {filteredDoubts.length === 0 ? 'No doubts' : filteredDoubts.map(d => (
                <div key={d._id}>{d.title}</div>
              ))}
            </div>
          )}

          {activeTab === 'tutors' && (
            <div>
              {filteredTutors.length === 0 ? 'No tutors' : filteredTutors.map(t => (
                <div key={t._id}>{t.user?.name}</div>
              ))}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {filteredUsers.length === 0 ? 'No users' : filteredUsers.map(u => (
                <div key={u._id}>{u.name}</div>
              ))}
            </div>
          )}

          {activeTab === 'ads' && (
            <div>
              {ads.length === 0 ? 'No ads' : ads.map(a => (
                <div key={a._id}>{a.title}</div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AdminPanel;

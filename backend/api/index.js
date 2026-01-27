const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// Routes
// --------------------
app.use('/api/auth', require('../routes/auth'));
app.use('/api/doubts', require('../routes/doubts'));
app.use('/api/solutions', require('../routes/solutions'));
app.use('/api/tutors', require('../routes/tutors'));
app.use('/api/admin', require('../routes/admin'));
app.use('/api/subscriptions', require('../routes/subscriptions'));
app.use('/api/ads', require('../routes/ads'));

// --------------------
// MongoDB (serverless-safe)
// --------------------
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err.message));
}

// --------------------
// Health check
// --------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running on Vercel',
    mongoState: mongoose.connection.readyState
  });
});

// --------------------
// Error handler
// --------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// --------------------
// 404 handler
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --------------------
// IMPORTANT
// --------------------
module.exports = app;



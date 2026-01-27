const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  extractedText: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'assigned', 'solved', 'matched'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  matchedSolution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  },
  assignedTutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solution'
  },
  priority: {
    type: String,
    enum: ['normal', 'high'],
    default: 'normal'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  solvedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
});

module.exports = mongoose.model('Doubt', doubtSchema);

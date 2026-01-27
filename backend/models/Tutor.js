const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalSolutions: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  assignedDoubts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Tutor', tutorSchema);

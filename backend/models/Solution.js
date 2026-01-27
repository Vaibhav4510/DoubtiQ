const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['text', 'video', 'mixed'],
    required: true
  },
  content: {
    type: String
  },
  steps: [{
    stepNumber: Number,
    description: String,
    imageUrl: String
  }],
  videoUrl: {
    type: String
  },
  youtubeVideoId: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solution', solutionSchema);

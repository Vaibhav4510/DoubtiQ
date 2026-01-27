const express = require('express');
const Tutor = require('../models/Tutor');
const Doubt = require('../models/Doubt');
const Solution = require('../models/Solution');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tutors/my-assignments
// @desc    Get tutor's assigned doubts
// @access  Private (Tutor)
router.get('/my-assignments', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user.id });
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    // Only show verified and assigned doubts (not pending)
    const doubts = await Doubt.find({ 
      assignedTutor: req.user.id,
      isVerified: true,
      status: { $in: ['verified', 'assigned', 'solved'] },
      isDeleted: false
    })
      .populate('user', 'name email')
      .populate('solution', 'content videoUrl youtubeVideoId type steps')
      .sort({ submittedAt: -1 });

    res.json(doubts);
  } catch (error) {
    console.error('Tutor assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/tutors/profile
// @desc    Get tutor profile with computed stats (solutions, views, earnings)
// @access  Private (Tutor)
router.get('/profile', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user.id })
      .populate('user', 'name email');

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    const userId = tutor.user?._id || tutor.user;

    const [solutions, assignedCount] = await Promise.all([
      Solution.find({ tutor: userId }).catch(() => []),
      Doubt.countDocuments({
        assignedTutor: userId,
        isDeleted: false
      }).catch(() => 0)
    ]);

    const totalSolutions = solutions.length;
    const totalViews = solutions.reduce((sum, sol) => sum + (sol.views || 0), 0);
    const earnings = totalViews * 0.01; // same rate as admin stats

    res.json({
      ...tutor.toObject(),
      totalSolutions,
      totalViews,
      earnings,
      assignedDoubts: assignedCount
    });
  } catch (error) {
    console.error('Tutor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tutors/profile
// @desc    Update tutor profile
// @access  Private (Tutor)
router.put('/profile', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { specialization } = req.body;
    
    const tutor = await Tutor.findOne({ user: req.user.id });
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    if (specialization) {
      tutor.specialization = specialization;
    }

    await tutor.save();
    res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

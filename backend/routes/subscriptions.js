const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/subscriptions/upgrade
// @desc    Upgrade to premium
// @access  Private
router.post('/upgrade', protect, async (req, res) => {
  try {
    const { planDuration } = req.body; // in months

    const user = await User.findById(req.user.id);
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (planDuration || 1));

    user.subscription = {
      type: 'premium',
      startDate,
      endDate,
      isActive: true
    };

    await user.save();

    res.json({
      message: 'Subscription upgraded successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/status
// @desc    Get subscription status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription');
    
    // Check if subscription is still valid
    if (user.subscription.isActive && user.subscription.endDate < new Date()) {
      user.subscription.isActive = false;
      user.subscription.type = 'free';
      await user.save();
    }

    res.json(user.subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

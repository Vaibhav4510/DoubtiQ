const express = require('express');
const Ad = require('../models/Ad');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/ads
// @desc    Get active ads (public for free users)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    const query = { isActive: true };
    
    if (position) {
      query.position = position;
    }

    const ads = await Ad.find(query).sort({ createdAt: -1 });

    // Increment impressions
    ads.forEach(ad => {
      ad.impressions += 1;
      ad.save();
    });

    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ads
// @desc    Create an ad
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, imageUrl, link, position } = req.body;

    const ad = await Ad.create({
      title,
      imageUrl,
      link,
      position
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ads/all
// @desc    Get all ads (admin)
// @access  Private (Admin)
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/ads/:id
// @desc    Update an ad
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/ads/:id
// @desc    Delete an ad
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ads/:id/click
// @desc    Track ad click
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (ad) {
      ad.clicks += 1;
      await ad.save();
    }

    res.json({ message: 'Click tracked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

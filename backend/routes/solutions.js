const express = require('express');
const Solution = require('../models/Solution');
const Doubt = require('../models/Doubt');
const Tutor = require('../models/Tutor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// @route   POST /api/solutions
// @desc    Create a solution (tutor only)
// @access  Private (Tutor)
router.post('/', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { doubtId, type, content, steps, videoUrl } = req.body;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    if (doubt.assignedTutor?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to solve this doubt' });
    }

    const hasSteps = Array.isArray(steps) && steps.some(s => (s?.description || '').trim());
    const hasContent = !!(content && String(content).trim());
    const hasVideo = !!(videoUrl && String(videoUrl).trim());

    if (!hasSteps && !hasContent && !hasVideo) {
      return res.status(400).json({ message: 'Please provide steps, content, or a YouTube video URL' });
    }

    let youtubeVideoId = null;
    if (hasVideo) {
      youtubeVideoId = extractYouTubeId(videoUrl);
      if (!youtubeVideoId) {
        return res.status(400).json({ message: 'Invalid YouTube URL' });
      }
    }

    const finalType =
      type ||
      (hasVideo && (hasSteps || hasContent) ? 'mixed' : (hasVideo ? 'video' : 'text'));

    const solution = await Solution.create({
      doubt: doubtId,
      tutor: req.user.id,
      type: finalType,
      content: hasContent ? content : undefined,
      steps: hasSteps ? steps : [],
      videoUrl: hasVideo ? videoUrl : undefined,
      youtubeVideoId
    });

    // Update doubt
    doubt.status = 'solved';
    doubt.solution = solution._id;
    doubt.solvedAt = new Date();
    await doubt.save();

    // Update tutor stats
    const tutor = await Tutor.findOne({ user: req.user.id });
    if (tutor) {
      tutor.totalSolutions += 1;
      await tutor.save();
    }

    res.status(201).json(solution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/solutions/:id
// @desc    Update a solution (tutor only)
// @access  Private (Tutor)
router.put('/:id', protect, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { type, content, steps, videoUrl } = req.body;
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    if (solution.tutor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this solution' });
    }

    const hasSteps = Array.isArray(steps) && steps.some(s => (s?.description || '').trim());
    const hasContent = !!(content && String(content).trim());
    const hasVideo = typeof videoUrl === 'string' ? !!videoUrl.trim() : !!videoUrl;

    if (typeof type === 'string' && type.trim()) solution.type = type.trim();
    if (content !== undefined) solution.content = hasContent ? content : '';
    if (steps !== undefined) solution.steps = hasSteps ? steps : [];

    if (videoUrl !== undefined) {
      if (hasVideo) {
        const youtubeVideoId = extractYouTubeId(videoUrl);
        if (!youtubeVideoId) {
          return res.status(400).json({ message: 'Invalid YouTube URL' });
        }
        solution.videoUrl = videoUrl;
        solution.youtubeVideoId = youtubeVideoId;
      } else {
        solution.videoUrl = '';
        solution.youtubeVideoId = '';
      }
    }

    // Auto-type if client didn't explicitly set it
    if (!type) {
      const nowHasVideo = !!(solution.videoUrl && String(solution.videoUrl).trim());
      const nowHasSteps = Array.isArray(solution.steps) && solution.steps.some(s => (s?.description || '').trim());
      const nowHasContent = !!(solution.content && String(solution.content).trim());
      solution.type = (nowHasVideo && (nowHasSteps || nowHasContent)) ? 'mixed' : (nowHasVideo ? 'video' : 'text');
    }

    await solution.save();
    res.json(solution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/solutions/:id
// @desc    Get a solution
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('doubt', 'title content imageUrl')
      .populate('tutor', 'name email');

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    // Increment views
    solution.views += 1;
    await solution.save();

    res.json(solution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

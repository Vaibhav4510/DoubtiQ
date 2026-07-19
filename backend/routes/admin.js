const express = require('express');
const Doubt = require('../models/Doubt');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Ad = require('../models/Ad');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();


router.use(protect);
router.use(authorize('admin'));


router.get('/doubts', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status, isDeleted: false } : { isDeleted: false };
    
    const doubts = await Doubt.find(query)
      .populate('user', 'name email')
      .populate('assignedTutor', 'name email')
      .populate('matchedSolution', 'content videoUrl youtubeVideoId type steps')
      .populate('solution', 'content videoUrl youtubeVideoId type steps')
      .sort({ submittedAt: -1 });

    res.json(doubts);
  } catch (error) {
    console.error('Doubts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/doubts/:id/verify', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    doubt.isVerified = true;
    doubt.status = 'verified';
    await doubt.save();

    res.json(doubt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/doubts/:id/assign', async (req, res) => {
  try {
    const { tutorId } = req.body;
    
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    if (!doubt.isVerified) {
      return res.status(400).json({ message: 'Doubt must be verified before assigning' });
    }

    const tutor = await Tutor.findOne({ user: tutorId });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    doubt.assignedTutor = tutorId;
    doubt.status = 'assigned';
    await doubt.save();

    tutor.assignedDoubts.push(doubt._id);
    await tutor.save();

    res.json(doubt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/doubts/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    if (title) doubt.title = title;
    if (content) doubt.content = content;
    
    await doubt.save();
    res.json(doubt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/doubts/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }


    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doubt permanently deleted' });
  } catch (error) {
    console.error('Delete doubt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/tutors', async (req, res) => {
  try {
    const Solution = require('../models/Solution');
    const Doubt = require('../models/Doubt');
    const tutors = await Tutor.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });


    const tutorsWithStats = await Promise.all(tutors.map(async (tutor) => {
   
      const userId = tutor.user?._id || tutor.user;
      
      if (!userId) {
        return {
          ...tutor.toObject(),
          totalSolutions: 0,
          totalViews: 0,
          earnings: 0,
          assignedDoubts: 0
        };
      }

      const totalSolutions = await Solution.countDocuments({ tutor: userId }).catch(() => 0);
      const solutions = await Solution.find({ tutor: userId }).catch(() => []);
      const totalViews = solutions.reduce((sum, sol) => sum + (sol.views || 0), 0);
      const earnings = totalViews * 0.01; // $0.01 per view
      const assignedDoubts = await Doubt.countDocuments({ 
        assignedTutor: userId,
        isDeleted: false 
      }).catch(() => 0);

      return {
        ...tutor.toObject(),
        totalSolutions,
        totalViews,
        earnings,
        assignedDoubts
      };
    }));

    res.json(tutorsWithStats);
  } catch (error) {
    console.error('Tutors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/tutors/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isActive = isActive;
    await tutor.save();

    res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/tutors/:id/verify', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isVerified = true;
    tutor.isActive = true;
    await tutor.save();

    res.json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/tutors/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

  
    await Tutor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tutor deleted successfully' });
  } catch (error) {
    console.error('Delete tutor error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    const Doubt = require('../models/Doubt');
    
 
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.json([]);
    }


    const usersWithStats = await Promise.all(users.map(async (user) => {
      try {
        const totalDoubts = await Doubt.countDocuments({ 
          user: user._id,
          isDeleted: false 
        }).catch(() => 0);

        return {
          ...user.toObject(),
          totalDoubts: totalDoubts || 0
        };
      } catch (err) {
        console.error(`Error processing user ${user._id}:`, err);
        return {
          ...user.toObject(),
          totalDoubts: 0
        };
      }
    }));

    res.json(usersWithStats);
  } catch (error) {
    console.error('Users error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

   
    const Doubt = require('../models/Doubt');
    await Doubt.deleteMany({ user: user._id });

    
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const Solution = require('../models/Solution');
    
   
    const [
      totalUsers,
      totalTutors,
      activeTutors,
      totalDoubts,
      pendingDoubts,
      verifiedDoubts,
      assignedDoubts,
      solvedDoubts,
      matchedDoubts,
      totalSolutions,
      premiumUsers
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }).catch(() => 0),
      Tutor.countDocuments().catch(() => 0),
      Tutor.countDocuments({ isActive: true }).catch(() => 0),
      Doubt.countDocuments().catch(() => 0),
      Doubt.countDocuments({ status: 'pending' }).catch(() => 0),
      Doubt.countDocuments({ status: 'verified' }).catch(() => 0),
      Doubt.countDocuments({ status: 'assigned' }).catch(() => 0),
      Doubt.countDocuments({ status: 'solved' }).catch(() => 0),
      Doubt.countDocuments({ status: 'matched' }).catch(() => 0),
      Solution.countDocuments().catch(() => 0),
      User.countDocuments({ 
        'subscription.type': 'premium', 
        'subscription.isActive': true 
      }).catch(() => 0)
    ]);

    res.json({
      totalUsers,
      totalTutors,
      activeTutors,
      totalDoubts,
      pendingDoubts,
      verifiedDoubts,
      assignedDoubts,
      solvedDoubts,
      matchedDoubts,
      totalSolutions,
      premiumUsers
    });
  } catch (error) {
    console.error('Stats error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;

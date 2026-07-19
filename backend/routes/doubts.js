const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Doubt = require('../models/Doubt');
const Solution = require('../models/Solution');
const { protect } = require('../middleware/auth');
const { extractTextFromImage, findMatchingSolution } = require('../utils/ocr');
const cloudinary = require('cloudinary').v2;

const router = express.Router();


if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doubt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});


const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};


router.post('/upload', protect, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    const { title, content } = req.body;
    let extractedText = content || '';
    let imageUrl = '';

  
    if (req.file) {
      const localPath = req.file.path;

      try {
       
        extractedText = await extractTextFromImage(localPath);
      } catch (error) {
        console.error('OCR extraction failed:', error);
      }

      try {
        if (cloudinary.config().cloud_name) {
       
          const uploadResult = await cloudinary.uploader.upload(localPath, {
            folder: 'doubtiq/doubts'
          });
          imageUrl = uploadResult.secure_url;
        } else {
         
          imageUrl = `/uploads/${req.file.filename}`;
        }
      } catch (uploadErr) {
        console.error('Cloudinary upload failed, falling back to local file:', uploadErr);
        imageUrl = `/uploads/${req.file.filename}`;
      } finally {
       
        fs.unlink(localPath, () => {});
      }
    }

   
    const doubt = await Doubt.create({
      user: req.user.id,
      title: title || 'Untitled Doubt',
      content: content || extractedText,
      imageUrl,
      extractedText,
      priority: req.user.subscription?.type === 'premium' ? 'high' : 'normal'
    });

    
    if (extractedText) {
      const matchedSolution = await findMatchingSolution(extractedText);
      
      if (matchedSolution) {
        doubt.status = 'matched';
        doubt.matchedSolution = matchedSolution._id;
        await doubt.save();

    
        const populatedSolution = await Solution.findById(matchedSolution._id)
          .populate('doubt', 'title content extractedText');

        return res.json({
          doubt,
          matched: true,
          solution: populatedSolution
        });
      }
    }


    res.json({
      doubt,
      matched: false,
      message: 'No matching solution found. Would you like to submit to tutors?'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/:id/submit', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    if (doubt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    doubt.status = 'pending';
    await doubt.save();

    res.json({ message: 'Doubt submitted successfully', doubt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/my-doubts', protect, async (req, res) => {
  try {
    const doubts = await Doubt.find({ 
      user: req.user.id,
      isDeleted: false 
    })
      .populate('matchedSolution', 'content videoUrl youtubeVideoId type steps')
      .populate('assignedTutor', 'name email')
      .populate('solution', 'content videoUrl youtubeVideoId type steps')
      .sort({ submittedAt: -1 });

    res.json(doubts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

 
    if (doubt.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'admin') {
      await Doubt.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Doubt permanently deleted' });
    } else {
      doubt.isDeleted = true;
      doubt.deletedAt = new Date();
      await doubt.save();
      return res.json({ message: 'Doubt deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('matchedSolution', 'content videoUrl youtubeVideoId type steps')
      .populate('assignedTutor', 'name email')
      .populate('solution', 'content videoUrl youtubeVideoId type steps')
      .populate('user', 'name email');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }


    if (
      doubt.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      (req.user.role !== 'tutor' || doubt.assignedTutor?._id?.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (doubt.solution?._id) {
      try {
        await Solution.findByIdAndUpdate(doubt.solution._id, { $inc: { views: 1 } });
      } catch (viewErr) {
        console.error('Error incrementing solution views:', viewErr);
      }
    }

    res.json(doubt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

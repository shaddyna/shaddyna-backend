/*const express = require('express');
const router = express.Router();
const multer = require('multer');
const skillsController = require('../controllers/skillController');

// Configure multer with no field limits for dynamic handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), false);
    }
  }
});

// Middleware to handle dynamic portfolio fields
const handleSkillUpload = (req, res, next) => {
  // Use .any() to accept all files regardless of field names
  upload.any()(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        // Special handling for unexpected files (like portfolio images)
        // We'll actually allow these through for dynamic processing
        return next();
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/', handleSkillUpload, skillsController.createSkill);
// GET ALL SKILLS
router.get('/', skillsController.getAllSkills);

// GET SINGLE SKILL
router.get('/:id', skillsController.getSkillById);



module.exports = router;*/

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware')

// Create a new skill
router.post(
  '/',
  protect,
  upload.array('images', 3), // Max 3 images
  skillController.createSkill
);

module.exports = router;
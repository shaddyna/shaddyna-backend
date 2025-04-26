/*const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');

// Create a new skill
router.post(
  '/',
  protect,
  upload.array('images', 3), // Max 3 images
  skillController.createSkill
);

// Get all skills
router.get('/', skillController.getAllSkills);

// Get single skill
router.get('/:id', skillController.getSkill);

// Update skill
router.put(
  '/:id',
  protect,
  upload.array('images', 3),
  skillController.updateSkill
);

// Delete skill
router.delete('/:id', protect, skillController.deleteSkill);

// Like/unlike skill
router.post('/:id/like', protect, skillController.toggleLike);

module.exports = router;*/

// routes/skillRoutes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware');

// Create a new skill
router.post(
  '/',
  protect,
  upload.array('images', 3),
  skillController.createSkill
);

// Get all skills
router.get('/', skillController.getAllSkills);

// Get single skill
router.get('/:id', skillController.getSkill);

// Update skill
router.put(
  '/:id',
  protect,
  upload.array('images', 3),
  skillController.updateSkill
);

// Delete skill
router.delete('/:id', protect, skillController.deleteSkill);

// Like/unlike skill
router.post('/:id/like', protect, skillController.toggleLike);

// Comment routes
router.post('/:id/comments', protect, skillController.addComment);
router.delete('/:id/comments/:commentId', protect, skillController.deleteComment);
router.post('/:id/comments/:commentId/replies', protect, skillController.addReply);
router.delete('/:id/comments/:commentId/replies/:replyId', protect, skillController.deleteReply);

module.exports = router;
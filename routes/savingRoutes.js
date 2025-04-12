const express = require('express');
const { getUserSavings, createSaving } = require('../controllers/savingController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/savings', protect, getUserSavings);
// POST route to create a saving
router.post('/create', protect, createSaving);

module.exports = router;





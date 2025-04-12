const express = require('express');
const { createWithdrawal } = require('../controllers/withdrawController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// POST route to create a withdrawal
router.post('/', protect, createWithdrawal);

module.exports = router;

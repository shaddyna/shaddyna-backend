const express = require('express');
const { transferFunds } = require('../controllers/transferController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, transferFunds);

module.exports = router;

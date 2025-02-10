const express = require('express');
const {  createPurchase } = require('../controllers/purchaseController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPurchase);

module.exports = router;

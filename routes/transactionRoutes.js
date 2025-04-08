// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET all transactions for a user
router.get('/:userId', transactionController.getUserTransactions);

module.exports = router;
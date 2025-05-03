// routes/transactionRoutes.js
/*const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET all transactions for a user
router.get('/:userId', transactionController.getUserTransactions);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// All transactions
router.get('/', transactionController.getAllTransactions);

// Transactions for a specific user
router.get('/user/:userId', transactionController.getUserTransactions);

// Get a single transaction
router.get('/:id', transactionController.getTransactionById);

// Delete a transaction
router.delete('/:id', transactionController.deleteTransaction);

// Update a transaction
router.put('/:id', transactionController.updateTransaction);

module.exports = router;

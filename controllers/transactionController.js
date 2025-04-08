// controllers/transactionController.js
const Transaction = require('../models/Transaction');

exports.getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
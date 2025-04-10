// controllers/transferController.js

const Balance = require('../models/Balance');
const Transaction = require('../models/Transaction');

const transferFunds = async (req, res) => {
  const senderId = req.user.id;
  const { recipientId, amount } = req.body;

  if (!recipientId || !amount) {
    return res.status(400).json({ message: 'Recipient ID and amount are required.' });
  }

  if (senderId === recipientId) {
    return res.status(400).json({ message: 'Cannot transfer to yourself.' });
  }

  const session = await require('mongoose').startSession();
  session.startTransaction();

  try {
    const senderBalance = await Balance.findOne({ userId: senderId }).session(session);
    const recipientBalance = await Balance.findOne({ userId: recipientId }).session(session);

    if (!senderBalance || senderBalance.totalBalance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient funds.' });
    }

    if (!recipientBalance) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Recipient balance record not found.' });
    }

    // Update balances
    const senderPrevious = senderBalance.totalBalance;
    const recipientPrevious = recipientBalance.totalBalance;

    senderBalance.totalBalance -= amount;
    recipientBalance.totalBalance += amount;

    await senderBalance.save({ session });
    await recipientBalance.save({ session });

    // Log transactions
    await Transaction.create([{
      userId: senderId,
      type: 'transfer_sent',
      amount,
      status: 'successful',
      balanceBefore: senderPrevious,
      balanceAfter: senderPrevious - amount
    }, {
      userId: recipientId,
      type: 'transfer_received',
      amount,
      status: 'successful',
      balanceBefore: recipientPrevious,
      balanceAfter: recipientPrevious + amount
    }], { session });

    await session.commitTransaction();
    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Transfer failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    session.endSession();
  }
};

module.exports = { transferFunds };


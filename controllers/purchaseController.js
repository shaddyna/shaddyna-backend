/*const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createPurchase = async (req, res) => {
  console.log("Received request to make a purchase");

  const userId = req.user?.id;
  const { amount, itemId } = req.body; // Item ID for the purchased good

  try {
    if (!userId || !amount || !itemId) {
      return res.status(400).json({ message: "Amount and item ID are required." });
    }

    // Fetch user's current balance
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      return res.status(400).json({ message: "No balance found for this user." });
    }

    // Check if the user has sufficient balance
    if (balance.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance - amount;

    // Log the purchase transaction
    const transaction = new Transaction({
      userId,
      type: 'purchase',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      itemId,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Purchase successful:", transaction);

    res.status(200).json({
      message: "Purchase successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPurchase };*/

const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

/*const createPurchase = async (req, res) => {
  console.log("Received request to make a purchase");

  const userId = req.user?.id;
  const { amount } = req.body; // Item ID for the purchased good

  try {
    if (!userId || !amount ) {
      return res.status(400).json({ message: "Amount is required." });
    }

    // Fetch user's current balance
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      return res.status(400).json({ message: "No balance found for this user." });
    }

    // Check if the user has sufficient balance
    if (balance.totalBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance - amount;

    // Log the purchase transaction
    const transaction = new Transaction({
      userId,
      type: 'purchase',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      itemId,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Purchase successful:", transaction);

    res.status(200).json({
      message: "Purchase successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/

const createPurchase = async (req, res) => {
  console.log("Received request to make a purchase");

  // Log the request headers and body for debugging
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);

  const userId = req.user?.id;
  const { amount, orderId } = req.body; // Added orderId for debugging

  try {
    if (!userId) {
      console.error("Error: User ID is missing.");
      return res.status(400).json({ message: "User not authenticated." });
    }

    if (!amount) {
      console.error("Error: Amount is missing in request.");
      return res.status(400).json({ message: "Amount is required." });
    }

    if (!orderId) {
      console.error("Error: Order ID is missing in request.");
      return res.status(400).json({ message: "Order ID is required." });
    }

    console.log(`Processing purchase for User ID: ${userId}, Amount: ${amount}, Order ID: ${orderId}`);

    // Fetch user's current balance
    let balance = await Balance.findOne({ userId });
    if (!balance) {
      console.error(`Error: No balance found for User ID: ${userId}`);
      return res.status(400).json({ message: "No balance found for this user." });
    }

    console.log(`User's current balance: ${balance.totalBalance}`);

    // Check if the user has sufficient balance
    if (balance.totalBalance < amount) {
      console.error(`Error: Insufficient balance. Required: ${amount}, Available: ${balance.totalBalance}`);
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const previousBalance = balance.totalBalance;
    const newBalance = previousBalance - amount;

    // Log the purchase transaction
    const transaction = new Transaction({
      userId,
      type: 'purchase',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      orderId, // Ensure orderId is stored properly
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Purchase successful:", {
      transactionId: transaction._id,
      newBalance,
    });

    res.status(200).json({
      message: "Purchase successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { createPurchase };
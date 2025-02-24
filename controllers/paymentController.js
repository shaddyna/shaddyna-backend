const Payment = require("../models/SeminarPayment"); // Import Payment model
const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');


// Handle M-Pesa Payment
const payWithMpesa = async (req, res) => {
  try {
    const { phoneNumber, mpesaCode, mpesaName, amount } = req.body;

    if (!phoneNumber || !mpesaCode || !mpesaName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const payment = new Payment({
      phoneNumber,
      mpesaCode,
      mpesaName,
      amount,
      method: "mpesa",
      status: "pending",
    });

    await payment.save();
    res.status(201).json({ message: "Payment recorded successfully.", payment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Handle Savings Payment
/*const payWithSavings = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      console.warn("Validation Error: Missing required fields", { userId, amount });
      return res.status(400).json({ message: "User ID and amount are required." });
    }

    const payment = new Payment({
      userId,
      amount,
      method: "savings",
      status: "pending",
    });

    await payment.save();

    console.log("✅ Savings payment recorded successfully:", { userId, amount, paymentId: payment._id });
    res.status(201).json({ message: "Savings payment recorded successfully.", payment });
  } catch (error) {
    console.error("❌ Error processing savings payment:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};*/


const payWithSavings = async (req, res) => {
  try {
    const { userId, amount, } = req.body;

    if (!userId || !amount ) {
      console.warn("Validation Error: Missing required fields", { userId, amount, seminarId });
      return res.status(400).json({ message: "User ID, amount, and seminar ID are required." });
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

    // Create a new transaction record for seminar payment
    const transaction = new Transaction({
      userId,
      type: 'seminar',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      //seminarId,
    });
    await transaction.save();

    // Update user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    // Record the payment in Payment model
    const payment = new Payment({
      userId,
      amount,
      method: "savings",
      status: "successful",
    });
    await payment.save();

    console.log("✅ Seminar payment successful via savings:", { transaction, payment });

    res.status(200).json({
      message: "Seminar payment successful via savings.",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("❌ Error processing seminar payment via savings:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { payWithMpesa, payWithSavings };

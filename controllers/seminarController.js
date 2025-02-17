/*const Transaction = require('../models/Transaction');
const Balance = require('../models/Balance');

const createSeminarPayment = async (req, res) => {
  console.log("Received request to pay for seminar");

  const userId = req.user?.id;
  const { amount, seminarId } = req.body; // ID of the seminar being paid for

  try {
    if (!userId || !amount || !seminarId) {
      return res.status(400).json({ message: "Amount and seminar ID are required." });
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

    // Log the seminar payment transaction
    const transaction = new Transaction({
      userId,
      type: 'seminar',
      amount,
      status: 'successful',
      balanceBefore: previousBalance,
      balanceAfter: newBalance,
      seminarId,
    });

    await transaction.save();

    // Update the user's balance
    balance.totalBalance = newBalance;
    await balance.save();

    console.log("Seminar payment successful:", transaction);

    res.status(200).json({
      message: "Seminar payment successful",
      transaction,
      newBalance: balance.totalBalance,
    });
  } catch (error) {
    console.error("Error processing seminar payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createSeminarPayment };*/
const Seminar = require('../models/Seminar');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Create a new seminar with image upload
 * @route   POST /api/seminars
 * @access  Public
 */
const createSeminar = async (req, res) => {
  try {
    const { name, description, date, amount } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Upload image to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "seminars" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.end(req.file.buffer);
    });

    const imageUrl = await uploadPromise;
    const newSeminar = new Seminar({ name, description, date, amount, image: imageUrl });
    await newSeminar.save();

    res.status(201).json({ message: "Seminar created successfully", newSeminar });
  } catch (error) {
    console.error("Error creating seminar:", error);
    res.status(500).json({ error: "Failed to create seminar" });
  }
};

/**
 * @desc    Get all seminars
 * @route   GET /api/seminars
 * @access  Public
 */
const getSeminars = async (req, res) => {
  try {
    const seminars = await Seminar.find();
    res.status(200).json(seminars);
  } catch (error) {
    console.error("Error fetching seminars:", error);
    res.status(500).json({ error: "Failed to fetch seminars" });
  }
};

// Get a single seminar by ID
 const getSeminarById = async (req, res) => {
  try {
    const seminar = await Seminar.findById(req.params.id);
    if (!seminar) return res.status(404).json({ error: "Seminar not found" });
    res.status(200).json(seminar);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch seminar" });
  }
};

// Update a seminar
const updateSeminar = async (req, res) => {
  try {
    const { name, image, description, date, amount } = req.body;
    const updatedSeminar = await Seminar.findByIdAndUpdate(
      req.params.id,
      { name, image, description, date, amount },
      { new: true, runValidators: true }
    );

    if (!updatedSeminar) return res.status(404).json({ error: "Seminar not found" });

    res.status(200).json({ message: "Seminar updated successfully", updatedSeminar });
  } catch (error) {
    res.status(500).json({ error: "Failed to update seminar" });
  }
};

// Delete a seminar
 const deleteSeminar = async (req, res) => {
  try {
    const deletedSeminar = await Seminar.findByIdAndDelete(req.params.id);
    if (!deletedSeminar) return res.status(404).json({ error: "Seminar not found" });

    res.status(200).json({ message: "Seminar deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete seminar" });
  }
};

module.exports = {
  createSeminar,
  getSeminars,
  deleteSeminar,
  updateSeminar,
  getSeminarById,
};



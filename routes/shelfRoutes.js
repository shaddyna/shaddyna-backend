/*const express = require('express');
const router = express.Router();
const multer = require('multer');
const shelfController = require('../controllers/shelfController');

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.fieldname, file.originalname);
    cb(null, true);
  }
});

// ✅ Create shelf
router.post(
  "/create",
  upload.any(), // Accept any files
  shelfController.createShelf
);

// ✅ Get all shelves
router.get("/shelves", shelfController.getAllShelves);

// ✅ Get single shelf by ID
router.get("/:id", shelfController.getShelfById);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createShelf,
  getAllShelves,
  getShelfById,
  updateShelf,
  deleteShelf
} = require("../controllers/shelfController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" });

// Create a new shelf
router.post("/", authMiddleware, upload.single("banner"), createShelf);

// Get all shelves
router.get("/",  getAllShelves);

// Get shelf by ID
router.get("/:id", getShelfById);

// Update shelf
router.put("/:id", authMiddleware, upload.single("banner"), updateShelf);

// Delete shelf
router.delete("/:id", authMiddleware, deleteShelf);

module.exports = router;


/*const express = require('express');
const router = express.Router();
const multer = require('multer');
const shelfController = require('../controllers/shelfController');

// Configure Multer storage
const storage = multer.memoryStorage(); // Or use diskStorage if needed
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.fieldname, file.originalname);
    cb(null, true);
  }
});

// Route with proper Multer configuration
router.post(
  "/create",
  upload.any(), // or upload.array('images') if you know the exact field name
  shelfController.createShelf
);

// Get all shelves
router.get("/shelves", shelfController.getAllShelves);

module.exports = router;*/

const express = require('express');
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

module.exports = router;

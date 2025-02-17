const express = require("express");
const protect = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createStartup,
  getAllStartups,
  getStartupById,
  updateStartup,
  deleteStartup,
} = require("../controllers/startupController");

router.post('/', createStartup);

// Get all Startups
router.get("/", getAllStartups);

// Get Startup by ID
router.get("/:id", getStartupById);

// Update Startup by ID
router.put("/:id", updateStartup);

// Delete Startup by ID
router.delete("/:id", deleteStartup);

module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
// Multer setup
const storage = multer.memoryStorage(); // Store in memory before uploading to Cloudinary
const upload = multer({ storage });

const {  createShop , getAllShops, getShopById } = require("../controllers/shopController");

router.post("/create", upload.array("images", 5), createShop);

// Route to fetch all shops
router.get("/shops", getAllShops);

// Route to get a specific shop by ID
router.get("/:id", getShopById); 

module.exports = router;



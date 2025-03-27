/*const express = require("express");
const router = express.Router();
const { createShelf, getAllShelves, getShelfById, updateShelf, deleteShelf } = require("../controllers/shelfController");

router.post("/create", createShelf);
router.get("/shelves", getAllShelves);
router.get("/:id", getShelfById);
router.put("/:id", updateShelf);
router.delete("/:id", deleteShelf);
// Route to get a specific shop by ID
//router.get("/:id", getShopById); 

module.exports = router;*/

const User = require("../models/User");
const express = require("express");
//const {shelfController} = require("../controllers/shelfController");
const { createShelf, getAllShelves, getShelfById, updateShelf, deleteShelf } = require("../controllers/shelfController");

const router = express.Router();

// Create a new shelf
router.post("/create", createShelf);

// Get all shelves
router.get("/shelves", getAllShelves);


module.exports = router;
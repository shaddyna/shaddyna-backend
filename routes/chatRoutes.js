// routes/chatRoutes.js
/*const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const router = express.Router();

router.post("/sendMessage", sendMessage);

router.get("/getMessage", getMessages);

module.exports = router;*/


const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const router = express.Router();

// Send a message
router.post("/send", sendMessage);

// Fetch messages between sender and receiver
router.get("/:sender/:receiver", getMessages);

module.exports = router;

const express = require("express");
const router = express.Router();
//const withdrawalController = require("../controllers/withdrawalController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure user is authenticated
//const adminMiddleware = require("../middleware/adminMiddleware"); // Ensure admin access

//router.get("/balance", authMiddleware, withdrawalController.getBalance);
//router.post("/withdraw", authMiddleware, withdrawalController.requestWithdrawal);
//router.patch("/withdraw/:id", adminMiddleware, withdrawalController.updateWithdrawalStatus);

module.exports = router;

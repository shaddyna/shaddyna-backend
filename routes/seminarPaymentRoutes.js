const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// M-Pesa Payment Route
router.post("/pay/mpesa", paymentController.payWithMpesa);

// Savings Payment Route
router.post("/pay/savings", paymentController.payWithSavings);

module.exports = router;

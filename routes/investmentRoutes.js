const express = require('express')
const { createInvestment } = require('../controllers/investmentController')
const protect = require('../middleware/authMiddleware')
const router = express.Router()

// POST route to create an investment
router.post('/', protect, createInvestment)

module.exports = router
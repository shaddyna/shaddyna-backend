const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/place-order', orderController.place_order);

module.exports = router;

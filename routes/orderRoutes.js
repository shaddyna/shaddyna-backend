const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/place-order', orderController.place_order);
// Route to get all orders
router.get('/orders', orderController.getOrders);

// Route to get a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

module.exports = router;

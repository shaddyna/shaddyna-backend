/*const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/place-order', orderController.place_order);
// Route to get all orders
router.get('/orders', orderController.getOrders);


router.get('/orders/customer/:customerId', orderController.getOrdersByCustomerId);

// Route to get a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

router.get('/:sellerId', orderController.getOrdersBySellerId);

module.exports = router;*/

const express = require('express');
const { createOrder, getUserOrders, getOrderDetails } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', protect, createOrder);

// Get user's orders
router.get('/my-orders', protect, getUserOrders);

// Get order details
router.get('/customer/orders/:id', protect, getOrderDetails);

module.exports = router;

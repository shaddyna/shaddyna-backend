/*const express = require('express');
const { createOrder, getUserOrders, getOrderDetails } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', protect, createOrder);

// Get user's orders
router.get('/my-orders', protect, getUserOrders);

// Get order details
router.get('orders/customer/:id', protect, getOrderDetails);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersBySeller
} = require('../controllers/orderController');
const  protect  = require('../middleware/authMiddleware');

// Create a new order
router.post('/', protect, createOrder);

router.get('/seller/:sellerId', getOrdersBySeller);

// Get user's own orders
router.get('/my-orders', protect, getUserOrders);

// Get details of a specific order (buyer, seller, admin)
router.get('/customer/:id', protect, getOrderDetails);

// ✅ Get all orders (admin)
router.get('/', getAllOrders);

// ✅ Update order status
router.put('/:id', protect, updateOrder);

// ✅ Delete order (admin)
router.delete('/:id', protect, deleteOrder);

module.exports = router;


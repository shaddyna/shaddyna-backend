const Order = require('../models/Order');
const { orderValidator } = require('../validators/orderValidator');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Validate request body
    const { error } = orderValidator.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details);
      return res.status(400).json({ 
        error: error.details[0].message,
        details: error.details
      });
    }

    const { shippingInfo, payments, items } = req.body;

    // Verify the buyer matches the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user session' });
    }

    // Prepare payments with complete item data
    const preparedPayments = payments.map(payment => {
      const sellerItems = items.filter(item => item.sellerId === payment.sellerId);
      return {
        ...payment,
        items: sellerItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          sellerId: item.sellerId
        }))
      };
    });

    // Calculate total amount
    const totalAmount = preparedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Create order
    const order = new Order({
      buyerId: req.user.id,
      shipping: shippingInfo,
      payments: preparedPayments,
      totalAmount,
      status: 'pending'
    });

    // Validate seller-item relationships
    for (const payment of preparedPayments) {
      for (const item of payment.items) {
        const product = await Product.findById(item._id);
        if (!product) {
          return res.status(400).json({ 
            error: `Product ${item._id} not found` 
          });
        }
        
        if (item.sellerId.toString() !== payment.sellerId) {
          return res.status(400).json({ 
            error: `Product ${item._id} does not belong to seller ${payment.sellerId}` 
          });
        }
      }
    } 

    // Save order
    await order.save();
    console.log('Order created successfully:', order);

    // Update product stocks
    for (const item of items) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get user's orders with enhanced security
const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user session' });
    }

    const orders = await Order.find({ buyerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'payments.sellerId',
        select: 'name email'
      })
      .populate({
        path: 'payments.items.productId',
        select: 'name price image'
      });

    res.json({ 
      success: true, 
      count: orders.length,
      orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

// Get order details with strict access control
 const getOrderDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user session' });
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: 'buyerId',
        select: 'name email'
      })
      .populate({
        path: 'payments.sellerId',
        select: 'name email'
      })
      .populate({
        path: 'payments.items.productId',
        select: 'name price image'
      });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Enhanced authorization check
    const isBuyer = order.buyerId._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSeller = order.payments.some(p => 
      p.sellerId._id.toString() === req.user.id
    );

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized access to this order' });
    }

    res.json({ 
      success: true, 
      order,
      userRole: req.user.role // For frontend to adapt UI if needed
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order details',
      details: error.message 
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    //if (!req.user || req.user.role !== 'admin') {
      //return res.status(403).json({ error: 'Only admins can access all orders' });
    //}

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('buyerId', 'name email')
      .populate('payments.sellerId', 'name email');

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Failed to fetch all orders', details: error.message });
  }
};

const getOrdersBySeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Find orders that contain at least one payment by the seller
    const orders = await Order.find({ 'payments.sellerId': sellerId })
      .sort({ createdAt: -1 })
      .populate('buyerId', 'name email')
      .populate('payments.sellerId', 'name email');

    // Filter only the payments and items for that seller in each order
    const filteredOrders = orders.map(order => {
      const sellerPayments = order.payments.filter(payment =>
        payment.sellerId._id.toString() === sellerId
      );

      return {
        _id: order._id,
        buyer: order.buyerId,
        shipping: order.shipping,
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        payments: sellerPayments
      };
    });

    res.json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders
    });

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Failed to fetch seller orders', details: error.message });
  }
};


// ✅ Update Order (status only)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only admin or seller in that order can update
    const isAdmin = req.user.role === 'admin';
    const isSeller = order.payments.some(p => p.sellerId.toString() === req.user.id);
    if (!isAdmin && !isSeller) {
      return res.status(403).json({ error: 'Unauthorized to update this order' });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
};

// ✅ Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only admin can delete orders
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete orders' });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getOrdersBySeller
};
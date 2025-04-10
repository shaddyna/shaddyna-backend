import Order from '../models/Order.js';
import { orderValidator } from '../validators/orderValidator.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
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

/*import Order from '../models/Order.js';
import { orderValidator } from '../validators/orderValidator.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Log the incoming request

   // Validate request body
const { error } = orderValidator.validate(req.body);
if (error) {
  // Log the full error details to the console
  console.log('Validation error:', error.details);

  // Send a response with the error message
  return res.status(400).json({ 
    error: error.details[0].message,
    details: error.details // this will provide more detailed error information
  });
}

    const { shippingInfo, payments, items } = req.body;

    // Verify the buyer matches the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid user session' });
    }

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Create order
    const order = new Order({
      buyerId: req.user.id, 
      shippingInfo, 
      payments, 
      totalAmount,
      status: 'pending'
    });

    // Log before processing items
    console.log("Validating items:", items);

    // Additional validation: Verify all items belong to the specified sellers
 // Additional validation: Verify all items belong to the specified sellers
for (const payment of payments) {
  for (const item of items) { 
    const product = await Product.findById(item._id);
    if (!product) {
      console.log(`Product not found: ${item._id}`);
      return res.status(400).json({ 
        error: `Product ${item._id} not found` 
      });
    }

    console.log(`Validating product ${item._id} with sellerId ${item.sellerId}`);
    
    // Ensure sellerId comparison is between strings
    if (!item.sellerId) {
      console.log(`Product ${item._id} does not have a valid sellerId`);
      return res.status(400).json({ 
        error: `Product ${item._id} does not have a valid sellerId` 
      });
    }
    
    const productSellerId = item.sellerId.toString(); // Ensure it’s a string for comparison
    console.log(`Product Seller ID (string): ${productSellerId}`);
    console.log(`Payment Seller ID: ${payment.sellerId}`);
    
    if (productSellerId !== payment.sellerId) {
      console.log(`Seller mismatch: Product ${item._id} belongs to seller ${productSellerId}, but payment is for seller ${payment.sellerId}`);
      return res.status(400).json({ 
        error: `Product ${item._id} does not belong to seller ${payment.sellerId}` 
      });
    }
  }
}
 
    
 
    // Save order
    await order.save();

    // Log after saving order
    console.log("Order saved successfully:", order);

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
      details: error.message 
    });
  }
};
*/

// Get user's orders with enhanced security
export const getUserOrders = async (req, res) => {
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
export const getOrderDetails = async (req, res) => {
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
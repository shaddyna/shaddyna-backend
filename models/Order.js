const mongoose = require("mongoose");


const paymentItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  color: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, // Add this line
    ref: 'Product',  // Assuming you have a Product model to reference
    required: true
  }
});

const paymentSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  mpesaCode: {
    type: String,
    required: true
  },
  mpesaName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  items: [paymentItemSchema]
}, { timestamps: true });

const shippingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  additionalInfo: String
});

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  shipping: shippingSchema,
  payments: [paymentSchema],
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports =  Order;
 
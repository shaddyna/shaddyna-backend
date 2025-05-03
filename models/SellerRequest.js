const mongoose = require('mongoose');

const sellerRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank'],
    default: 'mpesa'
  },
  mpesaName: String,
  mpesaCode: {
    type: String,
    required: function() { return this.paymentMethod === 'mpesa'; }
  },
  amount: {
    type: Number,
    required: true
  },
  processedAt: Date,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('SellerRequest', sellerRequestSchema);
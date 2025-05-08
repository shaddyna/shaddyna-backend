/*const mongoose = require('mongoose');

const MemberRequestSchema = new mongoose.Schema({
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

module.exports = mongoose.model('MemberRequest', MemberRequestSchema);*/

// models/MembershipRequest.js
const mongoose = require('mongoose');

const membershipRequestSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mpesaName: { type: String, required: true },
  mpesaCode: { type: String, required: true },
  amount: { type: Number, required: true, default: 500 },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewedAt: { type: Date },
  notes: { type: String }
}, { timestamps: true });

const MembershipRequest = mongoose.model('MembershipRequest', membershipRequestSchema);

module.exports = MembershipRequest;
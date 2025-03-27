
/*const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String, 
});

const ShelfSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: String,
  members: [MemberSchema], 
});

module.exports = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);*/

const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  role: {
    type: String,
    default: 'member'
  }
}, { _id: false });

const ShelfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['product', 'service', 'investment'],
    default: 'product'
  },
  openForMembers: {
    type: Boolean,
    default: true
  },
  members: [MemberSchema],
  products: {
    type: [String],
    default: []
  },
  investments: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ShelfSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);

/*const mongoose = require("mongoose");

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

const ProductDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  }
}, { _id: false });

const ServiceDetailsSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true
  },
  availability: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  }]
}, { _id: false });

const InvestmentDetailsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  roi: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  duration: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
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
  productDetails: [ProductDetailsSchema],
  serviceDetails: [ServiceDetailsSchema],
  investmentDetails: [InvestmentDetailsSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ShelfSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["admin", "contributor", "viewer"], default: "viewer" },
});

const shelfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  bannerImage: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  members: [memberSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: [{ type: String, enum: ["products", "services", "investments"] }],
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  inviteLink: { type: String },
  rules: String,
  tags: [String],
});

module.exports = mongoose.model("Shelf", shelfSchema);*/

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  joinedAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "contributor", "viewer"],
    default: "viewer",
  },
});

// Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
});

// Service schema
const serviceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  duration: { type: String, required: true }, 
  availability: [{ type: String }], 
});

// Investment schema
const investmentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  roi: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  duration: { type: String, required: true },
  riskLevel: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
});

const shelfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    bannerImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [memberSchema],
    type: {
      type: String,
      enum: ["product", "service", "investment"],
      required: true,
    },
    product: { type: productSchema },
    service: { type: serviceSchema },
    investment: { type: investmentSchema },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    inviteLink: { type: String },
    rules: String,
    tags: [String],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Shelf", shelfSchema);


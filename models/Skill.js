/*const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 10 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  pimage: { type: String, required: true },
  portfolio: [portfolioItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const skillSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  price: { type: Number },
  priceType: { 
    type: String, 
    enum: ['hourly', 'fixed', 'negotiable'],
    default: 'hourly'
  },
  images: [{ type: String }], // Will store Cloudinary URLs
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String },
    avatar: { type: String },
    bio: { type: String },
    location: { type: String },
    skills: [{ type: String }],
    joinedAt: { type: Date }
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  stats: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Skill', skillSchema);
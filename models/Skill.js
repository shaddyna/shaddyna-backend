/*const mongoose = require('mongoose');
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

module.exports = mongoose.model('Skill', skillSchema);*/

// models/Skill.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, },
    avatar: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  replies: [{
    content: { type: String, required: true },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
     // name: { type: String, required: true },
      name: { type: String},
      avatar: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
  }]
});

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
  images: [{ type: String }],
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
  },
  comments: [commentSchema] 
});

module.exports = mongoose.model('Skill', skillSchema);
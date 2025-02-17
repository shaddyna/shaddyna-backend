// models/Member.js
const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({

  startupName: {
    type: String,
    required: true,
  },
  ideaDescription: {
    type: String,
    required: true,
  },
  estimatedValue: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactEmail:{
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: String,
    enum: ['startup', 'non'],
    default: 'non', // Default value is 'nonmember'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model('Startup', startupSchema);

module.exports = Member;

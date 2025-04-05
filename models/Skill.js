/*const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String, // Added image field for each member
});

const SkillSchema = new mongoose.Schema({
  name: String,
  description: String,
  service: String,
  cimage: String,
  pimage: String,
  level:String,
  stdprice:String,
  stdprice: String,
  contact:String,
  portfolio: [PortfolioSchema], // Each member now includes an image
});

module.exports = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

*/

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Skill', skillSchema);
const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
});

const ReviewSchema = new mongoose.Schema({
  username: String,
  rating: Number,
  comment: String,
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: false },
  level: { type: String, required: false },
  rating: { type: Number, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  cimage: { type: String, required: false },
  pimage: { type: String, required: false },
  portfolio: [PortfolioSchema],
  reviews: [ReviewSchema],
});

module.exports = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);


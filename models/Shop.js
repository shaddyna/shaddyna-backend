/*const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);*/
/*const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  image: { type: String, required: true }, // Add this field for storing the image URL
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);*/

const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    openingHours: { type: String, default: "09:00" },
    closingHours: { type: String, default: "18:00" },
    email: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    socialMedias: { 
      type: [{
        platform: String,
        url: String
      }], 
      default: [] 
    },
    images: { type: [String], required: true },
    //owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Add index for better query performance
shopSchema.index({ name: 'text', description: 'text', category: 1 });

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;


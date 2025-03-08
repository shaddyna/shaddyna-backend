/*const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: false,
  },
  shelfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelf', // Reference to the Shelf model instead of Seller
    required: false,
  },
  name: { type: String, required: false },
  slug: { type: String, required: false, unique: false },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  brand: { type: String, required: false },
  price: { type: Number, required: false },
  stock: { type: Number, required: false },
  discount: { type: Number, default: 0 },
  description: { type: String, required: false },
  shopName: { type: String, required: false },
  images: [{ type: String }], // Array to store image file paths
  rating: { type: Number, default: 0 },
  colors: [{ type: String }],
  tags: [{ type: String }],
}, { timestamps: false });

module.exports = mongoose.model('Product', productSchema);*/

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    attributes: { type: mongoose.Schema.Types.Mixed, required: true }, // Dynamic attributes
    images: { type: [String], required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;


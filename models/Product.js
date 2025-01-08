const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: false,
  },
  name: { type: String, required: false },
  slug: { type: String, required: false, unique: false },
  category: { type: String, required: false },
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

module.exports = mongoose.model('Product', productSchema);

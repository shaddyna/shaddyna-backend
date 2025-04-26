const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    tags: [String],
   
    type: [{ type: String, enum: ["product", "service", "investment"], required: true }],
    //type: [{ type: String, enum: ["product", "service", "investment"] }],
    product: { type: mongoose.Schema.Types.Mixed },
    service: { type: mongoose.Schema.Types.Mixed },
    investment: { type: mongoose.Schema.Types.Mixed },
    shelf: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Shelf", 
      required: true 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: {
      type: String,
      enum: ["active", "archived", "sold", "completed"],
      default: "active",
    },
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
    images: [{
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
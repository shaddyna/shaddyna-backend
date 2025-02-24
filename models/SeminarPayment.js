const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: false },
  mpesaCode: { type: String, required: false },
  mpesaName: { type: String, required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  amount: { type: Number, required: false },
  method: { type: String, enum: ["mpesa", "savings"], required: true },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);

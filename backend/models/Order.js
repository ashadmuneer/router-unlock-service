const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  country: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  network: { type: String, required: true },
  imei: { type: String, required: true },
  serialNumber: { type: String, required: true },
  mobileNumber: { type: String },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  termsAccepted: { type: Boolean, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  paymentStatus: { type: String, default: "Pending" },
  paymentTime: { type: Date },
  paymentType: { type: String, enum: ["PayPal"], default: "PayPal" },
  deliveryTime: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
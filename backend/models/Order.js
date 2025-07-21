// backend/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  shippingOption: { type: String, required: true },
  cartItems: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  subtotal: Number,
  discount: Number,
  tax: Number,
  shippingCost: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);

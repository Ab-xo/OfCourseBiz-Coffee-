// backend/controllers/orderController.js
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};
// backend/controllers/orderController.js

export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentMethod = req.body.paymentMethod;
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Payment update failed" });
  }
};

// backend/controllers/orderController.js
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order" });
  }
};


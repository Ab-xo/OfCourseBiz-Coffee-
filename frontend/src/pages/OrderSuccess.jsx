import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`
        );
        setOrder(response.data);
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading order details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <p className="text-red-600 text-xl">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
        >
          Go Home
        </button>
      </div>
    );

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4 flex items-center justify-center">
      <motion.div
        className="max-w-lg w-full bg-white p-10 rounded-lg shadow-lg text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-green-600 mb-6">
          🎉 Payment Successful!
        </h1>
        <p className="text-lg mb-4">
          Thank you, <strong>{order.fullName}</strong>! Your payment for order{" "}
          <strong>{order._id}</strong> was successful.
        </p>
        <p className="mb-6">
          Total Paid:{" "}
          <span className="font-semibold text-amber-800">
            ETB {order.total.toFixed(2)}
          </span>
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-amber-800 text-white font-semibold rounded hover:bg-amber-900 transition"
        >
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
};

export default OrderSuccess;

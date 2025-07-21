import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const PayNow = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order data on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`
        );
        setOrder(response.data);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Chapa Payment Handler
  const handleChapaPayment = () => {
    if (!order) return;
    setPaymentLoading(true);

    // Chapa requires amount in Ethiopian Birr
    const amount = order.total.toFixed(2);
    const email = order.email;
    const fullName = order.fullName;

    // Create payment data object
    const paymentData = {
      amount,
      currency: "ETB",
      email,
      first_name: fullName.split(" ")[0],
      last_name: fullName.split(" ")[1] || "",
      tx_ref: order._id, // unique reference, use order id
      callback_url: `http://localhost:3000/pay-now/callback/${order._id}`, // you can adjust this callback URL
      return_url: `http://localhost:3000/order-success/${order._id}`, // after payment success page
    };

    // Call Chapa inline script payment (or backend API)
    // For demo, we'll use Chapa inline JS (can be integrated via script tag)
    // For production, you might want to handle this server-side or via your backend

    if (!window.Chapa) {
      alert("Chapa payment library not loaded.");
      setPaymentLoading(false);
      return;
    }

    window.Chapa.checkout({
      key: "CHAPUBK_TEST-BUS7oxssHIbqUgocpYPt0V9q5xJ0HFL0", // <-- Replace with your Chapa public key
      amount: paymentData.amount,
      currency: paymentData.currency,
      email: paymentData.email,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      tx_ref: paymentData.tx_ref,
      callback_url: paymentData.callback_url,
      return_url: paymentData.return_url,
      onclose: () => {
        setPaymentLoading(false);
        alert("Payment closed. You can try again.");
      },
      onsuccess: (data) => {
        // Payment success
        setPaymentLoading(false);
        alert("Payment successful!");
        // Redirect or update backend payment status
        navigate(`/order-success/${order._id}`);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-xl">{error}</p>
        <Link
          to="/"
          className="ml-4 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-lg">
        <motion.h1
          className="text-3xl font-bold mb-6 text-center text-amber-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Pay Now
        </motion.h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p>
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {order.fullName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {order.email}
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span>{" "}
            <span className="text-amber-800 font-bold">
              ETB {order.total.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Items</h3>
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {order.cartItems.map((item) => (
              <li
                key={item._id || item.id}
                className="py-2 flex justify-between items-center"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleChapaPayment}
          disabled={paymentLoading}
          className={`w-full py-3 text-white rounded-lg font-semibold transition-colors ${
            paymentLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-amber-800 hover:bg-amber-900"
          }`}
        >
          {paymentLoading ? "Processing Payment..." : "Pay with Chapa"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Cancel and Go Back
        </button>
      </div>
    </section>
  );
};

export default PayNow;

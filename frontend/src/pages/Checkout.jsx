import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart() || {
    cartItems: [],
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [savedOrderId, setSavedOrderId] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shippingOption, setShippingOption] = useState("standard");
  const discountCode = "SAVE10";
  const appliedDiscount = discountCode === "SAVE10" ? 0.1 : 0;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = "Valid email is required";
    if (!formData.phone.match(/^\+?[\d\s-]{10,}$/))
      newErrors.phone = "Valid phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.match(/^\d{5}(-\d{4})?$/))
      newErrors.postalCode = "Valid postal code is required";
    return newErrors;
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity || 0),
      0
    );
    const shippingCost = shippingOption === "standard" ? 5 : 15;
    const discount = subtotal * appliedDiscount;
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal - discount + tax + shippingCost;
    return { subtotal, discount, tax, shippingCost, total };
  };

  const { subtotal, discount, tax, shippingCost, total } = calculateTotals();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const orderData = {
          ...formData,
          shippingOption,
          paymentMethod: "pending",
          cartItems,
          subtotal,
          discount,
          tax,
          shippingCost,
          total,
        };

        const response = await axios.post(
          "http://localhost:5000/api/orders/create",
          orderData
        );
        const savedOrder = response.data;

        setSavedOrderId(savedOrder._id);
        setShowConfirmation(true); // show modal instead of redirecting
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center"
        >
          Checkout
        </motion.h2>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xl text-gray-600 mb-6">
              Your cart is empty. Add items to proceed to checkout.
            </p>
            <Link
              to="/menu"
              className="bg-amber-800 hover:bg-amber-900 text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Billing Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Billing Form */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Billing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "fullName",
                    "email",
                    "phone",
                    "address",
                    "city",
                    "postalCode",
                  ].map((field) => (
                    <div key={field} className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={`mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 ${
                          errors[field] ? "border-red-600" : ""
                        }`}
                      />
                      {errors[field] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-10 w-96"
              style={{ minWidth: "360px", maxWidth: "480px" }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-6 max-h-[900px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-amber-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Shipping */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Shipping
                  </h4>
                  {["standard", "express"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center mb-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={type}
                        checked={shippingOption === type}
                        onChange={() => setShippingOption(type)}
                        className="mr-2"
                      />
                      {type === "standard"
                        ? "Standard Shipping ($5.00)"
                        : "Express Shipping ($15.00)"}
                    </label>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-800">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 mt-4">
                  <Link
                    to="/menu"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" /> Continue Shopping
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="flex-1 bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-lg font-semibold"
                  >
                    Place Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Order Confirmation
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you, {formData.fullName || "Customer"}! Your order has
                  been placed.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      navigate(`/pay-now/${savedOrderId}`); // go to pay now page
                    }}
                    className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Checkout;

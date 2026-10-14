import crypto from "crypto";
import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { getRazorpay } from "../config/razorpay.js";

const isBlank = (value) => typeof value !== "string" || value.trim() === "";

// Returns an error message, or null if the address is fine
const validateAddress = (address) => {
  if (!address) return "Shipping address is required";

  const fields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
  for (const field of fields) {
    if (isBlank(address[field])) return `${field} is required`;
  }

  if (!/^\d{10}$/.test(address.phone.trim())) return "Phone must contain 10 digits";
  if (!/^\d{6}$/.test(address.pincode.trim())) return "Pincode must contain 6 digits";
  return null;
};

// POST /orders/create-payment-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const addressError = validateAddress(shippingAddress);
    if (addressError) {
      return res.status(400).json({ success: false, message: addressError });
    }

    const customer = await Customer.findById(req.user._id);
    if (customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Load the latest product data again, never trust the frontend
    const items = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return res.status(400).json({ success: false, message: "A product in your cart no longer exists" });
      }
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });
      totalAmount += product.price * cartItem.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      totalAmount,
    });

    // Razorpay wants the amount in paise
    let razorpayOrder;
    try {
      razorpayOrder = await getRazorpay().orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });
    } catch (err) {
      // Don't leave a pending order behind if Razorpay is unreachable
      await Order.findByIdAndDelete(order._id);
      throw err;
    }

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not create payment order" });
  }
};

// POST /orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_payment_id, razorpay_signature } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(200).json({ success: true, order });
    }

    // Use the razorpay order id saved in our DB, not the one from the browser
    const body = order.razorpayOrderId + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Reduce stock for what was bought
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Cart is cleared only after payment is verified
    const customer = await Customer.findById(req.user._id);
    customer.cart = [];
    await customer.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not verify payment" });
  }
};

// GET /orders
export const getOrders = async (req, res) => {
  try {
    // Only paid orders are real orders, pending ones are abandoned checkouts
    const orders = await Order.find({ user: req.user._id, paymentStatus: "PAID" }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    // Filtering by user means other people's orders come back as 404
    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

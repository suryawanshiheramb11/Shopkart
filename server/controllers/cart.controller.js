import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Loads the cart with product details filled in
const getPopulatedCart = async (userId) => {
  const customer = await Customer.findById(userId).populate({
    path: "cart.product",
    select: "name price category image stock",
  });
  // Skip items whose product was deleted
  return customer.cart.filter((item) => item.product);
};

// POST /cart/:productId
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);
    const item = customer.cart.find((i) => i.product.toString() === productId);

    // Same product again increases quantity instead of adding a new row
    const newQuantity = item ? item.quantity + 1 : 1;
    if (newQuantity > product.stock) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    if (item) {
      item.quantity = newQuantity;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }
    await customer.save();

    const cart = await getPopulatedCart(req.user._id);
    return res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /cart
export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// PATCH /cart/:productId
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a number of at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    const customer = await Customer.findById(req.user._id);
    const item = customer.cart.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    item.quantity = quantity;
    await customer.save();

    const cart = await getPopulatedCart(req.user._id);
    return res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const customer = await Customer.findById(req.user._id);
    customer.cart = customer.cart.filter((i) => i.product.toString() !== productId);
    await customer.save();

    const cart = await getPopulatedCart(req.user._id);
    return res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

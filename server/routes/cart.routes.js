import express from "express";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const cartRoutes = express.Router();

cartRoutes.get("/", isAuthenticated, getCart);
cartRoutes.post("/:productId", isAuthenticated, addToCart);
cartRoutes.patch("/:productId", isAuthenticated, updateQuantity);
cartRoutes.delete("/:productId", isAuthenticated, removeFromCart);

export default cartRoutes;

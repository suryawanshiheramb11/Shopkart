import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  changePassword,
} from "../controllers/customer.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const customerRoutes = express.Router();

customerRoutes.post("/register", registerUser);
customerRoutes.post("/login", loginUser);
customerRoutes.get("/me", isAuthenticated, getMe);
customerRoutes.post("/logout", isAuthenticated, logoutUser);
customerRoutes.patch("/change-password", isAuthenticated, changePassword);

export default customerRoutes;

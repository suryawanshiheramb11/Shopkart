import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

// Protects routes by verifying the JWT stored in the HttpOnly cookie
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id).select("-password");
    if (!customer) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    req.user = customer;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
};

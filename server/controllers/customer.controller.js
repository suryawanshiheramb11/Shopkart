import bcrypt from "bcrypt";
import Customer from "../models/customer.model.js";
import generateToken, { COOKIE_NAME } from "../utils/generateToken.js";

// POST /customers/register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// POST /customers/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const customer = await Customer.findOne({ email });

    // Same generic error whether the email or the password was wrong
    if (!customer) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    generateToken(res, customer._id);

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /customers/me
export const getMe = async (req, res) => {
  // req.user is attached by the isAuthenticated middleware and already excludes the password
  return res.status(200).json(req.user);
};

// POST /customers/logout
export const logoutUser = async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// PATCH /customers/change-password (bonus)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Old and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "New password must be at least 6 characters" });
    }

    const customer = await Customer.findById(req.user._id);

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
    if (!isOldPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    await customer.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

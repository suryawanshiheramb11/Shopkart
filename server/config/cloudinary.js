import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Loaded here too since ES module imports run before index.js's own dotenv.config() call
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

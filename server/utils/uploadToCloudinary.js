import cloudinary from "../config/cloudinary.js";

// Uploads an in-memory file buffer (from multer) to Cloudinary and resolves with its secure URL
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "shopkart/products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export default uploadToCloudinary;

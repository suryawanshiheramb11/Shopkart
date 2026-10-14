import multer from "multer";

// Keeps the uploaded file in memory so it can be streamed straight to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;

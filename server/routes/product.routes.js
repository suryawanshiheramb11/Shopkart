import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";

const productRoutes = express.Router();

productRoutes.post("/", upload.single("image"), createProduct);
productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProductById);

export default productRoutes;

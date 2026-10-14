import mongoose from "mongoose";
import Product from "../models/product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// POST /products (multipart/form-data with an "image" file field)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image is required" });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
    }

    const image = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({ name, description, price, category, image, stock });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /products?search=&category=&sort=
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    let productsQuery = Product.find(query);

    // Bonus: sort by price when requested
    if (sort === "price_asc") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "price_desc") productsQuery = productsQuery.sort({ price: -1 });

    const products = await productsQuery;

    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const WISHLIST_LABELS = {
  idle: "♡ Add to Wishlist",
  saving: "⏳ Saving...",
  added: "♥ Added to Wishlist",
};

const ProductCard = ({ product }) => {
  const inStock = product.stock > 0;
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState("");

  const handleAddToCart = async () => {
    setAdding(true);
    setCartError("");
    try {
      await addToCart(product._id);
    } catch (error) {
      // 401 means not logged in
      setCartError(
        error.response?.status === 401 ? "Please login first." : error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setAdding(false);
    }
  };
  const [wishlistStatus, setWishlistStatus] = useState("idle"); // idle | saving | added | error

  const handleAddToWishlist = async () => {
    if (wishlistStatus === "saving" || wishlistStatus === "added") return;

    setWishlistStatus("saving");
    try {
      await api.post(`/wishlist/${product._id}`);
      setWishlistStatus("added");
    } catch (error) {
      setWishlistStatus("error");
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-well">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <p className={`stock-badge ${inStock ? "" : "out-of-stock"}`}>
          <span className="stock-dot" />
          {inStock ? `${product.stock} units left` : "Out of stock"}
        </p>
        <Link to={`/products/${product._id}`} className="primary-button">
          View details
        </Link>
        <button type="button" className="primary-button" onClick={handleAddToCart} disabled={adding || !inStock}>
          {adding ? "Adding..." : "Add to Cart"}
        </button>
        {cartError && <p className="error-text">{cartError}</p>}
        <button
          type="button"
          className="wishlist-button"
          onClick={handleAddToWishlist}
          disabled={wishlistStatus === "saving" || wishlistStatus === "added"}
        >
          {WISHLIST_LABELS[wishlistStatus] || WISHLIST_LABELS.idle}
        </button>
        {wishlistStatus === "error" && (
          <p className="error-text wishlist-error">Unable to save product. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

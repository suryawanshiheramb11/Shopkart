import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setStatus("loading");
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    setCartError("");
    try {
      await addToCart(product._id);
    } catch (error) {
      setCartError(
        error.response?.status === 401 ? "Please login first." : error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setAdding(false);
    }
  };

  if (status === "loading") return <p className="status-text">Loading product...</p>;
  if (status === "error")
    return <p className="status-text error-text">Something went wrong while loading this product.</p>;

  const inStock = product.stock > 0;

  return (
    <div className="page-container product-details">
      <div className="product-details-image-well">
        <img src={product.image} alt={product.name} className="product-details-image" />
      </div>
      <div className="product-details-info">
        <span className="product-category">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="product-details-description">{product.description}</p>
        <p className="product-price">₹{product.price}</p>
        <p className={`stock-badge ${inStock ? "" : "out-of-stock"}`}>
          <span className="stock-dot" />
          {inStock ? `${product.stock} units left` : "Out of stock"}
        </p>
        <button className="primary-button" onClick={handleAddToCart} disabled={adding || !inStock}>
          {adding ? "Adding..." : "Add to Cart"}
        </button>
        {cartError && <p className="error-text">{cartError}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;

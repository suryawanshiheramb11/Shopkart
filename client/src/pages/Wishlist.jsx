import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import WishlistCard from "../components/WishlistCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  const fetchWishlist = async () => {
    setStatus("loading");
    try {
      const { data } = await api.get("/wishlist");
      setProducts(data.wishlist);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      // Leave the product visible if the removal request failed
    }
  };

  return (
    <div className="page-container">
      <h1>My Wishlist</h1>

      {status === "loading" && <p className="status-text">Loading your wishlist...</p>}

      {status === "error" && (
        <div className="status-text">
          <p className="error-text">Unable to load wishlist.</p>
          <button type="button" className="primary-button" onClick={fetchWishlist}>
            Try again
          </button>
        </div>
      )}

      {status === "success" && products.length === 0 && (
        <div className="status-text">
          <p>Your wishlist is empty.</p>
          <p>Save products you love and find them here later.</p>
          <Link to="/products" className="primary-button">
            Browse Products
          </Link>
        </div>
      )}

      {status === "success" && products.length > 0 && (
        <>
          <p className="wishlist-count">{products.length} products saved</p>
          <div className="product-grid">
            {products.map((product) => (
              <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;

import { Link } from "react-router-dom";

const WishlistCard = ({ product, onRemove }) => {
  const inStock = product.stock > 0;

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
        <button type="button" className="wishlist-button" onClick={() => onRemove(product._id)}>
          Remove ♥
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;

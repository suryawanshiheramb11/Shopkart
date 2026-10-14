import { useState } from "react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Runs a cart action and tracks loading/error for just this row
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-info">
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <div className="quantity-controls">
          <button
            type="button"
            disabled={busy || quantity <= 1}
            onClick={() => run(() => updateQuantity(product._id, quantity - 1))}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            disabled={busy || quantity >= product.stock}
            onClick={() => run(() => updateQuantity(product._id, quantity + 1))}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="wishlist-button"
          disabled={busy}
          onClick={() => run(() => removeFromCart(product._id))}
        >
          Remove
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>
      <p className="cart-item-total">₹{product.price * quantity}</p>
    </div>
  );
};

export default CartItem;

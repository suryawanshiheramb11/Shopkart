import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cartItems, loading, error, totalItems, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <p className="status-text">Loading your cart...</p>;

  if (error) {
    return (
      <div className="status-text">
        <p className="error-text">Unable to load your cart.</p>
        <button type="button" className="primary-button" onClick={fetchCart}>
          Try Again
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="status-text">
        <p>Your cart is empty 🛒</p>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="primary-button">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Cart</h1>
      <div className="cart-layout">
        <div className="cart-list">
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <button type="button" className="primary-button" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

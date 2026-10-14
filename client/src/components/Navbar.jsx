import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { customer, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ShopKart
      </Link>
      <div className="navbar-links">
        <Link to="/products">Products</Link>
        {customer ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart ({totalItems})</Link>
            <Link to="/orders">Orders</Link>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

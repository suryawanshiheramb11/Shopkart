import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { customer } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get("/cart");
      setCartItems(data.cart);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load the cart when someone logs in, empty it when they log out
  useEffect(() => {
    if (customer) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [customer]);

  // Every mutation returns the updated cart, so just store it
  const addToCart = async (productId) => {
    const { data } = await api.post(`/cart/${productId}`);
    setCartItems(data.cart);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.patch(`/cart/${productId}`, { quantity });
    setCartItems(data.cart);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCartItems(data.cart);
  };

  const clearCart = () => setCartItems([]);

  // Derived values, not stored anywhere
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        totalItems,
        subtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

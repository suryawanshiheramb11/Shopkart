import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import OrderCard from "../components/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  const fetchOrders = async () => {
    setStatus("loading");
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page-container">
      <h1>My Orders</h1>

      {status === "loading" && <p className="status-text">Loading your orders...</p>}

      {status === "error" && (
        <div className="status-text">
          <p className="error-text">Unable to load orders.</p>
          <button type="button" className="primary-button" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      )}

      {status === "success" && orders.length === 0 && (
        <div className="status-text">
          <p>You have not placed any orders yet.</p>
          <Link to="/products" className="primary-button">
            Start Shopping
          </Link>
        </div>
      )}

      {status === "success" &&
        orders.map((order) => <OrderCard key={order._id} order={order} />)}
    </div>
  );
};

export default Orders;

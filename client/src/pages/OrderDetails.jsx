import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";

// Also works as the order confirmation page when opened with ?success=true
const OrderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    fetchOrder();
  }, [id]);

  if (status === "loading") return <p className="status-text">Loading order...</p>;
  if (status === "error") return <p className="status-text error-text">Order not found.</p>;

  return (
    <div className="page-container">
      {searchParams.get("success") && <h1>✅ Order Placed Successfully</h1>}
      {!searchParams.get("success") && <h1>Order Details</h1>}

      <div className="order-card">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentStatus}
        </p>
        {order.items.map((item) => (
          <div className="summary-row" key={item._id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <p>
          <strong>Ship to:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{" "}
          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
        </p>
      </div>

      <Link to="/orders" className="primary-button">
        View My Orders
      </Link>{" "}
      <Link to="/products" className="primary-button">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderDetails;

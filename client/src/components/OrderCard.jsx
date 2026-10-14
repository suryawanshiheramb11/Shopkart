import { Link } from "react-router-dom";

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <h3>Order #{order._id.slice(-8)}</h3>
      <p className="muted">{new Date(order.createdAt).toLocaleDateString()}</p>
      {order.items.map((item) => (
        <p key={item._id}>
          {item.name} × {item.quantity}
        </p>
      ))}
      <p>
        <strong>Total: ₹{order.totalAmount}</strong>
      </p>
      <p>Status: {order.status}</p>
      <Link to={`/orders/${order._id}`} className="primary-button">
        View Details
      </Link>
    </div>
  );
};

export default OrderCard;

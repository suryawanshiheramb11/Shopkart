// Shows the cart lines and total, used on the checkout page
const OrderSummary = ({ items, total }) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {items.map((item) => (
        <div className="summary-row" key={item.product._id}>
          <span>
            {item.product.name} × {item.quantity}
          </span>
          <span>₹{item.product.price * item.quantity}</span>
        </div>
      ))}
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

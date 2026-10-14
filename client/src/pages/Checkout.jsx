import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import OrderSummary from "../components/OrderSummary";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    for (const field in form) {
      if (form[field].trim() === "") newErrors[field] = "This field is required.";
    }
    if (!newErrors.phone && !/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Phone must contain 10 digits.";
    }
    if (!newErrors.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Pincode must contain 6 digits.";
    }
    return newErrors;
  };

  const verifyPayment = async (data, response) => {
    try {
      await api.post("/orders/verify-payment", {
        shopKartOrderId: data.shopKartOrderId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      clearCart();
      navigate(`/orders/${data.shopKartOrderId}?success=true`);
    } catch (err) {
      setServerError(err.response?.data?.message || "Payment could not be verified.");
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setServerError("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setPlacing(true);
    try {
      const { data } = await api.post("/orders/create-payment-order", {
        shippingAddress: form,
      });

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setServerError("Could not load Razorpay. Check your internet connection.");
        setPlacing(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        // The backend decides if the payment is real
        handler: (response) => verifyPayment(data, response),
        modal: { ondismiss: () => setPlacing(false) },
        prefill: { name: form.fullName, contact: form.phone },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", () => {
        setServerError("Payment failed. Your cart has not been cleared. Please try again.");
        setPlacing(false);
      });
      paymentObject.open();
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="status-text">
        <p>Your cart is empty.</p>
        <Link to="/products" className="primary-button">
          Browse Products
        </Link>
      </div>
    );
  }

  const fields = [
    ["fullName", "Full Name"],
    ["phone", "Phone"],
    ["addressLine1", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "Pincode"],
  ];

  return (
    <div className="page-container">
      <h1>Checkout</h1>
      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping Details</h2>
          {fields.map(([name, label]) => (
            <div className="form-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input id={name} name={name} value={form[name]} onChange={handleChange} />
              {errors[name] && <p className="error-text">{errors[name]}</p>}
            </div>
          ))}
          {serverError && <p className="error-text">{serverError}</p>}
          <button type="submit" className="primary-button" disabled={placing}>
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </form>
        <OrderSummary items={cartItems} total={subtotal} />
      </div>
    </div>
  );
};

export default Checkout;

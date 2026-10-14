import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await api.post("/customers/login", formData);
      // The auth cookie is now set by the server; fetch the profile to populate auth state
      const { data } = await api.get("/customers/me");
      login(data);
      navigate("/home");
    } catch (err) {
      setError("Invalid Credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login to ShopKart</h1>
        {error && <p className="error-text">{error}</p>}

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@gmail.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New to ShopKart? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks access to a page until the /customers/me check confirms a logged-in customer
const ProtectedRoute = ({ children }) => {
  const { customer, loading } = useAuth();

  if (loading) return <p className="status-text">Loading...</p>;

  if (!customer) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { customer } = useAuth();

  return (
    <div className="page-container home-hero">
      <h1>Welcome back, {customer?.fullName}.</h1>
      <div className="profile-card">
        <p>
          <strong>Email:</strong> {customer?.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer?.phone}
        </p>
      </div>
      <Link to="/products" className="primary-button">
        Start shopping
      </Link>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Electronics", "Fashion", "Books", "Home"];

const FEATURES = [
  {
    title: "Search & filter instantly",
    description: "Find exactly what you need across Electronics, Fashion, Books and Home.",
  },
  {
    title: "Save for later",
    description: "Add anything to your wishlist and pick up right where you left off.",
  },
  {
    title: "Your account, your data",
    description: "Secure sign-in keeps your wishlist and profile just for you.",
  },
];

const Landing = () => {
  const { customer } = useAuth();

  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>Shop everything, delivered fast.</h1>
        <p>Search, save and buy in seconds — no clutter, no waiting.</p>
        <div className="landing-actions">
          <Link to="/products" className="primary-button">
            Browse products
          </Link>
          {customer ? (
            <Link to="/wishlist" className="landing-secondary-link">
              Go to my wishlist
            </Link>
          ) : (
            <Link to="/register" className="landing-secondary-link">
              Create an account
            </Link>
          )}
        </div>
      </section>

      <section className="landing-categories">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            to={`/products?category=${category}`}
            className="landing-category-card"
          >
            {category}
          </Link>
        ))}
      </section>

      <section className="landing-features">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="landing-feature">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Landing;

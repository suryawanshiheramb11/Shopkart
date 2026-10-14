import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Electronics", "Fashion", "Books", "Home"];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  // Lets the landing page link straight into a filtered category, e.g. /products?category=Books
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const fetchProducts = async () => {
      setStatus("loading");
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;

        const { data } = await api.get("/products", { params });
        setProducts(data.products);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    // Small debounce so a request isn't fired on every keystroke
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="page-container">
      <h1>Shop Products</h1>
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={CATEGORIES}
      />

      {status === "loading" && <p className="status-text">Loading products...</p>}
      {status === "error" && (
        <p className="status-text error-text">Something went wrong while loading products.</p>
      )}
      {status === "success" && products.length === 0 && (
        <p className="status-text">No products found.</p>
      )}

      {status === "success" && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

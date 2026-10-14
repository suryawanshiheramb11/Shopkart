const SearchBar = ({ search, onSearchChange, category, onCategoryChange, categories }) => {
  const allOptions = ["All", ...categories];

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="chip-track">
        {allOptions.map((option) => {
          const value = option === "All" ? "" : option;
          const isActive = category === value;
          return (
            <button
              key={option}
              type="button"
              className={`chip ${isActive ? "active" : ""}`}
              onClick={() => onCategoryChange(value)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "../../components/product/ProductCard";
import api from "../../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/products", {
        params: {
          search: search || undefined,
          category: category || undefined,
          page: 0,
          size: 20,
        },
      });

      setProducts(response.data.content || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  return (
    <div className="products-page">
      {/* HEADER */}
      <section className="products-header">
        <div>
          <span className="section-label">NEXCART STORE</span>

          <h1>Explore Products</h1>

          <p>
            Discover products from trusted sellers across different categories.
          </p>
        </div>

        <div className="products-count">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="products-filter-section">
        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button onClick={() => setSearch("")} className="clear-search">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="category-filter">
          <SlidersHorizontal size={18} />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            <option value="Electronics">Electronics</option>

            <option value="Fashion">Fashion</option>

            <option value="Home">Home</option>

            <option value="Books">Books</option>
          </select>
        </div>

        {(search || category) && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </section>

      {/* ACTIVE FILTERS */}
      {(search || category) && (
        <div className="active-filters">
          <span>Active filters:</span>

          {search && (
            <button onClick={() => setSearch("")}>
              Search: "{search}"
              <X size={13} />
            </button>
          )}

          {category && (
            <button onClick={() => setCategory("")}>
              {category}
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {/* PRODUCTS */}
      <section className="products-list-section">
        {loading && (
          <div className="products-loading">
            <div className="loader"></div>

            <h3>Finding products...</h3>

            <p>Please wait while we load the latest products.</p>
          </div>
        )}

        {error && !loading && (
          <div className="products-error">
            <div>⚠️</div>

            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button onClick={fetchProducts}>Try Again</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="no-products">
            <div className="empty-icon">🛍️</div>

            <h2>No products found</h2>

            <p>Try changing your search or category filter.</p>

            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;

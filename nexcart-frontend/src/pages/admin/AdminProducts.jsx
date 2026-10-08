import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Package, Trash2, Search } from "lucide-react";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/products");

      setProducts(response.data);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProduct(productId);
      setError("");

      const response = await api.delete(`/api/admin/products/${productId}`);

      /*
       * If the product has existing orders,
       * backend marks it unavailable instead
       * of physically deleting it.
       */
      if (response.data?.toLowerCase().includes("unavailable")) {
        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  quantity: 0,
                  available: false,
                }
              : product,
          ),
        );
      } else {
        setProducts((previousProducts) =>
          previousProducts.filter((product) => product.id !== productId),
        );
      }
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to delete product.";

      setError(message);
    } finally {
      setDeletingProduct(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    const productName = String(product.name || "").toLowerCase();
    const category = String(product.category || "").toLowerCase();
    const sellerName = String(product.sellerName || "").toLowerCase();

    return (
      productName.includes(searchText) ||
      category.includes(searchText) ||
      sellerName.includes(searchText)
    );
  });

  const getStockStatus = (product) => {
    if (!product.available || product.quantity === 0) {
      return {
        text: "OUT OF STOCK",
        className: "admin-product-stock admin-product-stock-out",
      };
    }

    if (product.quantity <= 5) {
      return {
        text: "LOW STOCK",
        className: "admin-product-stock admin-product-stock-low",
      };
    }

    return {
      text: "IN STOCK",
      className: "admin-product-stock admin-product-stock-in",
    };
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* ---------- Back Navigation ---------- */}

        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* ---------- Header ---------- */}

        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">PRODUCT MANAGEMENT</span>

            <h1>Products</h1>

            <p>Review and manage all marketplace products.</p>
          </div>

          <button className="admin-secondary-btn" onClick={fetchProducts}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* ---------- Error ---------- */}

        {error && <div className="admin-error">{error}</div>}

        {/* ---------- Search ---------- */}

        <div className="admin-product-toolbar">
          <div className="admin-product-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by product, category or seller..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-product-count">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ---------- Empty State ---------- */}

        {filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <Package size={40} />

            <h3>{search ? "No products found" : "No products yet"}</h3>

            <p>
              {search
                ? "Try a different search."
                : "Marketplace products will appear here."}
            </p>
          </div>
        ) : (
          /* ---------- Products Table ---------- */

          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);

                  return (
                    <tr key={product.id}>
                      {/* ---------- Product ---------- */}

                      <td>
                        <div className="admin-product-info">
                          <div className="admin-product-image">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} />
                            ) : (
                              <Package size={22} />
                            )}
                          </div>

                          <div>
                            <strong>{product.name}</strong>

                            <span>#{product.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* ---------- Category ---------- */}

                      <td>{product.category}</td>

                      {/* ---------- Seller ---------- */}

                      <td>{product.sellerName || "-"}</td>

                      {/* ---------- Price ---------- */}

                      <td>
                        <strong>
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </strong>
                      </td>

                      {/* ---------- Stock ---------- */}

                      <td>{product.quantity}</td>

                      {/* ---------- Status ---------- */}

                      <td>
                        <span className={stockStatus.className}>
                          {stockStatus.text}
                        </span>
                      </td>

                      {/* ---------- Action ---------- */}

                      <td>
                        <button
                          className="admin-delete-btn"
                          disabled={deletingProduct === product.id}
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 size={16} />

                          {deletingProduct === product.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

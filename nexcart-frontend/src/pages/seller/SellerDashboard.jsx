import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/seller/products?page=0&size=100");

      /*
       * Spring Data Page response:
       *
       * {
       *   content: [...]
       * }
       */

      setProducts(response.data.content || []);
    } catch (error) {
      console.error("Failed to load seller products:", error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load seller products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;

  const availableProducts = products.filter(
    (product) => product.available,
  ).length;

  const outOfStockProducts = products.filter(
    (product) => !product.available || product.quantity === 0,
  ).length;

  if (loading) {
    return (
      <div className="seller-page">
        <div className="seller-loading">
          <div className="seller-spinner"></div>
          <p>Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-page">
        <div className="seller-error">
          <AlertCircle size={22} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="seller-container">
        {/* HEADER */}

        <div className="seller-header">
          <div>
            <span className="seller-eyebrow">SELLER CENTER</span>

            <h1>Seller Dashboard</h1>

            <p>Manage your products and keep track of your store.</p>
          </div>

          <Link to="/seller/products/new" className="seller-primary-btn">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* STAT CARDS */}

        <div className="seller-stats">
          <div className="seller-stat-card">
            <div className="seller-stat-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Total Products</span>

              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon seller-success-icon">
              <CheckCircle size={22} />
            </div>

            <div>
              <span>Available</span>

              <strong>{availableProducts}</strong>
            </div>
          </div>

          <div className="seller-stat-card">
            <div className="seller-stat-icon seller-warning-icon">
              <AlertCircle size={22} />
            </div>

            <div>
              <span>Out of Stock</span>

              <strong>{outOfStockProducts}</strong>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="seller-section-header">
          <div>
            <h2>Store Management</h2>

            <p>Manage your products and orders.</p>
          </div>
        </div>

        <div className="seller-management-grid">
          <Link to="/seller/products" className="seller-management-card">
            <div className="seller-management-icon">
              <Package size={24} />
            </div>

            <div className="seller-management-content">
              <h3>My Products</h3>

              <p>Add, edit and manage your product inventory.</p>
            </div>

            <ArrowRight size={20} />
          </Link>

          <Link to="/seller/orders" className="seller-management-card">
            <div className="seller-management-icon">
              <ShoppingBag size={24} />
            </div>

            <div className="seller-management-content">
              <h3>Seller Orders</h3>

              <p>View customer orders and update order status.</p>
            </div>

            <ArrowRight size={20} />
          </Link>
        </div>

        {/* RECENT PRODUCTS */}

        <div className="seller-section-header seller-products-header">
          <div>
            <h2>Your Products</h2>

            <p>Recently added products.</p>
          </div>

          <Link to="/seller/products" className="seller-view-all">
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="seller-empty">
            <Package size={38} />

            <h3>No products yet</h3>

            <p>Add your first product to start selling on NexCart.</p>

            <Link to="/seller/products/new" className="seller-primary-btn">
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="seller-product-table">
            <div className="seller-table-header">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
            </div>

            {products.slice(0, 5).map((product) => (
              <div className="seller-table-row" key={product.id}>
                <div className="seller-product-name">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="seller-product-placeholder">
                      <Package size={20} />
                    </div>
                  )}

                  <span>{product.name}</span>
                </div>

                <span>{product.category}</span>

                <strong>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </strong>

                <span>{product.quantity}</span>

                <span
                  className={
                    product.available && product.quantity > 0
                      ? "seller-status available"
                      : "seller-status unavailable"
                  }
                >
                  {product.available && product.quantity > 0
                    ? "Available"
                    : "Out of Stock"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

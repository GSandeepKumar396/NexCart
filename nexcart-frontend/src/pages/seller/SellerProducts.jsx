import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/seller/products?page=0&size=100");

      setProducts(response.data.content || []);
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

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/api/seller/products/${productId}`);

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to delete product.";

      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="seller-page">
        <div className="seller-loading">
          <div className="seller-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="seller-container">
        <div className="seller-page-top">
          <div>
            <Link to="/seller" className="seller-back-link">
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <h1>My Products</h1>

            <p>Manage your product inventory.</p>
          </div>

          <Link to="/seller/products/new" className="seller-primary-btn">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {error && (
          <div className="seller-error">
            <AlertCircle size={20} />

            <span>{error}</span>
          </div>
        )}

        {products.length === 0 ? (
          <div className="seller-empty">
            <Package size={40} />

            <h3>No products found</h3>

            <p>Add your first product to your store.</p>

            <Link to="/seller/products/new" className="seller-primary-btn">
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="seller-products-grid">
            {products.map((product) => (
              <div className="seller-product-card" key={product.id}>
                <div className="seller-card-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <Package size={40} />
                  )}
                </div>

                <div className="seller-card-body">
                  <span className="seller-category">{product.category}</span>

                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <div className="seller-card-info">
                    <strong>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </strong>

                    <span>Stock: {product.quantity}</span>
                  </div>

                  <div className="seller-card-status">
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

                  <div className="seller-card-actions">
                    <button
                      className="seller-edit-btn"
                      onClick={() =>
                        navigate(`/seller/products/edit/${product.id}`)
                      }
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      className="seller-delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;

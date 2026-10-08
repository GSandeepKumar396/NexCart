import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowUpRight, Check } from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setAdding(true);
      setError("");

      await api.post("/api/customer/cart", {
        productId: product.id,
        quantity: 1,
      });

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to add product to cart.");

      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className="product-image-container">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="product-placeholder">🛍️</div>
        )}

        {product.available ? (
          <span className="stock-badge">In Stock</span>
        ) : (
          <span className="stock-badge out">Out of Stock</span>
        )}
      </div>

      {/* INFORMATION */}
      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3>{product.name}</h3>

        <p className="product-description">{product.description}</p>

        <div className="product-price-row">
          <div>
            <span className="price-label">Price</span>

            <strong className="product-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </strong>
          </div>

          <span className="seller-name">by {product.sellerName}</span>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="cart-error">{error}</p>}

        {/* ACTIONS */}
        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="view-product-btn">
            View Details
            <ArrowUpRight size={16} />
          </Link>

          {product.available && (
            <button
              className={`add-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={adding}
              title="Add to cart"
            >
              {adding ? (
                <span className="cart-spinner"></span>
              ) : added ? (
                <Check size={19} />
              ) : (
                <ShoppingCart size={19} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

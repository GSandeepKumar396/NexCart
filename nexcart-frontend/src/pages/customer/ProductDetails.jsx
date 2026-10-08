import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Package,
  User,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);

  const [added, setAdded] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
       FETCH PRODUCT
    ===================================================== */

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
       QUANTITY
    ===================================================== */

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    setQuantity((current) => Math.min(product.quantity, current + 1));
  };

  /* =====================================================
       ADD TO CART
    ===================================================== */

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");

      return;
    }

    if (!product?.available) {
      return;
    }

    try {
      setAdding(true);
      setError("");

      await api.post("/api/customer/cart", {
        productId: product.id,
        quantity: quantity,
      });

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2500);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  /* =====================================================
       LOADING
    ===================================================== */

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loader"></div>

        <h3>Loading product...</h3>
      </div>
    );
  }

  /* =====================================================
       ERROR
    ===================================================== */

  if (error && !product) {
    return (
      <div className="product-details-error">
        <div className="product-error-icon">⚠️</div>

        <h2>Unable to load product</h2>

        <p>{error}</p>

        <Link to="/products" className="back-products-btn">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const price = Number(product.price || 0);

  const stock = Number(product.quantity || 0);

  const isAvailable = product.available && stock > 0;

  return (
    <div className="product-details-page">
      {/* =================================================
               BACK
            ================================================= */}

      <Link to="/products" className="product-details-back">
        <ArrowLeft size={17} />
        Back to Products
      </Link>

      {/* =================================================
               PRODUCT
            ================================================= */}

      <section className="product-details-container">
        {/* =================================================
                   IMAGE
                ================================================= */}

        <div className="product-details-image-section">
          <div className="product-details-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-details-placeholder">🛍️</div>
            )}
          </div>

          {isAvailable ? (
            <div className="product-stock-badge">
              <span></span>
              In Stock
            </div>
          ) : (
            <div className="product-stock-badge out">Out of Stock</div>
          )}
        </div>

        {/* =================================================
                   INFORMATION
                ================================================= */}

        <div className="product-details-info">
          {/* CATEGORY */}

          <span className="product-details-category">{product.category}</span>

          {/* NAME */}

          <h1>{product.name}</h1>

          {/* DESCRIPTION */}

          <p className="product-details-description">{product.description}</p>

          {/* PRICE */}

          <div className="product-details-price-section">
            <span>Price</span>

            <strong>₹{price.toLocaleString("en-IN")}</strong>
          </div>

          {/* SELLER */}

          <div className="product-seller">
            <User size={18} />

            <div>
              <span>Sold by</span>

              <strong>{product.sellerName || "NexCart Seller"}</strong>
            </div>
          </div>

          {/* DIVIDER */}

          <div className="product-details-divider"></div>

          {/* STOCK */}

          {isAvailable && (
            <div className="product-stock-info">
              <Package size={18} />

              <span>
                {stock} {stock === 1 ? "item" : "items"} available
              </span>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="product-details-error-message">{error}</div>
          )}

          {/* =================================================
                       ACTIONS
                    ================================================= */}

          {isAvailable && (
            <div className="product-purchase-section">
              {/* QUANTITY */}

              <div className="quantity-section">
                <span>Quantity</span>

                <div className="product-quantity-control">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1 || adding}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= stock || adding}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* ADD TO CART */}

              <button
                className={`product-add-cart ${added ? "added" : ""}`}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? (
                  <>
                    <span className="button-spinner"></span>
                    Adding...
                  </>
                ) : added ? (
                  <>
                    <Check size={19} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={19} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          {!isAvailable && (
            <button className="product-unavailable-btn" disabled>
              Currently Unavailable
            </button>
          )}

          {/* SECURITY */}

          <div className="product-security">
            <ShieldCheck size={18} />

            <div>
              <strong>Secure Shopping</strong>

              <span>Your order is protected by NexCart.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;

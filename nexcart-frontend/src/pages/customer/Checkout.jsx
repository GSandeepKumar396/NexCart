import { useEffect, useState } from "react";
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Checkout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/customer/cart");

      setCart(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/api/customer/orders");

      console.log("Order response:", response.data);

      navigate("/orders");
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to place your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loader"></div>

        <h3>Preparing checkout...</h3>

        <p>Loading your order summary.</p>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-icon">
          <ShoppingBag size={40} />
        </div>

        <h2>Your cart is empty</h2>

        <p>Add some products before proceeding to checkout.</p>

        <Link to="/products" className="checkout-back-btn">
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((total, item) => {
    const price = Number(
      item.price ?? item.productPrice ?? item.product?.price ?? 0,
    );

    return total + price * item.quantity;
  }, 0);

  const delivery = 0;
  const total = subtotal + delivery;

  return (
    <div className="checkout-page">
      {/* HEADER */}

      <div className="checkout-header">
        <div>
          <span className="section-label">SECURE CHECKOUT</span>

          <h1>Complete Your Order</h1>

          <p>Review your order before placing it.</p>
        </div>
      </div>

      {/* STEPS */}

      <div className="checkout-steps">
        <div className="checkout-step active">
          <div className="step-number">1</div>

          <span>Review</span>
        </div>

        <div className="step-line"></div>

        <div className="checkout-step active">
          <div className="step-number">2</div>

          <span>Confirm</span>
        </div>

        <div className="step-line"></div>

        <div className="checkout-step">
          <div className="step-number">3</div>

          <span>Complete</span>
        </div>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-layout">
        {/* LEFT */}

        <section className="checkout-main">
          {/* DELIVERY */}

          <div className="checkout-card">
            <div className="checkout-card-header">
              <div className="checkout-card-icon">
                <Truck size={20} />
              </div>

              <div>
                <h2>Delivery Information</h2>

                <p>Your order will be delivered to your registered address.</p>
              </div>
            </div>

            <div className="delivery-placeholder">
              <ShieldCheck size={20} />

              <div>
                <strong>Secure delivery</strong>

                <span>
                  Delivery details will be handled during order processing.
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="checkout-card">
            <div className="checkout-card-header">
              <div className="checkout-card-icon">
                <CreditCard size={20} />
              </div>

              <div>
                <h2>Payment Method</h2>

                <p>Payment integration can be added later.</p>
              </div>
            </div>

            <div className="payment-option selected">
              <div className="payment-radio">
                <div></div>
              </div>

              <div>
                <strong>Cash / Demo Payment</strong>

                <span>No real payment will be processed.</span>
              </div>

              <CheckCircle size={19} className="payment-check" />
            </div>
          </div>

          {/* ITEMS */}

          <div className="checkout-card">
            <div className="checkout-card-title">
              <h2>Order Items</h2>

              <span>{items.length} products</span>
            </div>

            <div className="checkout-items">
              {items.map((item) => {
                const productId = item.productId ?? item.product?.id;

                const productName =
                  item.productName ?? item.product?.name ?? "Product";

                const price = Number(
                  item.price ?? item.productPrice ?? item.product?.price ?? 0,
                );

                const imageUrl = item.imageUrl ?? item.product?.imageUrl;

                return (
                  <div className="checkout-item" key={productId}>
                    <div className="checkout-item-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={productName} />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className="checkout-item-info">
                      <h3>{productName}</h3>

                      <span>Quantity: {item.quantity}</span>
                    </div>

                    <strong>
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT SUMMARY */}

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary-row">
            <span>Items</span>

            <strong>{items.length}</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>

            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>

            <strong className="free">FREE</strong>
          </div>

          <div className="checkout-summary-divider"></div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? (
              <>
                <span className="button-spinner"></span>
                Placing Order...
              </>
            ) : (
              <>
                Place Order
                <CheckCircle size={18} />
              </>
            )}
          </button>

          <div className="checkout-security">
            <ShieldCheck size={15} />

            <span>Secure & protected checkout</span>
          </div>

          <Link to="/cart" className="back-to-cart">
            <ArrowLeft size={15} />
            Back to Cart
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stores the product currently being updated/removed
  const [updatingProductId, setUpdatingProductId] = useState(null);

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
      setError("");

      const response = await api.get("/api/customer/cart");

      setCart(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, currentQuantity, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    try {
      setUpdatingProductId(productId);
      setError("");

      // Immediately update UI
      setCart((previousCart) => {
        if (!previousCart) {
          return previousCart;
        }

        return {
          ...previousCart,

          items: previousCart.items.map((item) => {
            const itemProductId = item.productId ?? item.product?.id;

            if (itemProductId !== productId) {
              return item;
            }

            return {
              ...item,
              quantity: newQuantity,
            };
          }),
        };
      });

      await api.put(`/api/customer/cart/${productId}`, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to update cart.");

      // Restore correct server state
      await fetchCart();
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingProductId(productId);
      setError("");

      // Immediately remove from UI
      setCart((previousCart) => {
        if (!previousCart) {
          return previousCart;
        }

        return {
          ...previousCart,

          items: previousCart.items.filter((item) => {
            const itemProductId = item.productId ?? item.product?.id;

            return itemProductId !== productId;
          }),
        };
      });

      await api.delete(`/api/customer/cart/${productId}`);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to remove item.");

      // Restore from server
      await fetchCart();
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loader"></div>

        <h3>Loading your cart...</h3>

        <p>Getting your selected products.</p>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="cart-error-page">
        <div className="cart-error-icon">⚠️</div>

        <h2>Unable to load cart</h2>

        <p>{error}</p>

        <button onClick={fetchCart}>Try Again</button>
      </div>
    );
  }

  const items = cart?.items || [];

  const subtotal = items.reduce((total, item) => {
    const price = Number(
      item.price ?? item.productPrice ?? item.product?.price ?? 0,
    );

    return total + price * item.quantity;
  }, 0);

  const delivery = 0;

  const total = subtotal + delivery;

  return (
    <div className="cart-page">
      {/* HEADER */}

      <section className="cart-header">
        <div>
          <span className="section-label">YOUR SHOPPING BAG</span>

          <h1>Your Cart</h1>

          <p>Review your products before placing your order.</p>
        </div>

        <div className="cart-item-count">
          <ShoppingBag size={19} />

          <span>
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>
      </section>

      {/* ERROR */}

      {error && <div className="cart-inline-error">{error}</div>}

      {/* EMPTY CART */}

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingCart size={42} />
          </div>

          <h2>Your cart is empty</h2>

          <p>Looks like you haven't added anything to your cart yet.</p>

          <Link to="/products" className="continue-shopping-btn">
            Start Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* ITEMS */}

          <section className="cart-items-section">
            <div className="cart-section-title">
              <h2>Cart Items</h2>

              <span>{items.length} products</span>
            </div>

            <div className="cart-items">
              {items.map((item) => {
                const productId = item.productId ?? item.product?.id;

                const productName =
                  item.productName ?? item.product?.name ?? "Product";

                const price = Number(
                  item.price ?? item.productPrice ?? item.product?.price ?? 0,
                );

                const imageUrl = item.imageUrl ?? item.product?.imageUrl;

                const itemTotal = price * item.quantity;

                const isUpdating = updatingProductId === productId;

                return (
                  <div className="cart-item" key={productId}>
                    {/* IMAGE */}

                    <div className="cart-item-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={productName} />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="cart-item-details">
                      <h3>{productName}</h3>

                      <p>₹{price.toLocaleString("en-IN")} each</p>

                      <button
                        className="remove-item-btn"
                        onClick={() => removeItem(productId)}
                        disabled={isUpdating}
                      >
                        <Trash2 size={14} />

                        {isUpdating ? "Updating..." : "Remove"}
                      </button>
                    </div>

                    {/* QUANTITY */}

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(
                            productId,
                            item.quantity,
                            item.quantity - 1,
                          )
                        }
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            productId,
                            item.quantity,
                            item.quantity + 1,
                          )
                        }
                        disabled={isUpdating}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* TOTAL */}

                    <div className="cart-item-total">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </section>

          {/* SUMMARY */}

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <strong className="free">FREE</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <div className="secure-checkout">🔒 Secure checkout</div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;

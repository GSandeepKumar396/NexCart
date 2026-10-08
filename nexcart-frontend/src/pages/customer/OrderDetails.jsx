import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const OrderDetails = () => {
  const { orderId } = useParams();

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
       FETCH ORDER
    ===================================================== */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrder();
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/customer/orders/${orderId}`);

      setOrder(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load order.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
       FORMAT DATE
    ===================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =====================================================
       STATUS CLASS
    ===================================================== */

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";

      case "CONFIRMED":
        return "status-confirmed";

      case "SHIPPED":
        return "status-shipped";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "";
    }
  };

  /* =====================================================
       STATUS ICON
    ===================================================== */

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLACED":
        return <Clock size={17} />;

      case "CONFIRMED":
        return <CheckCircle size={17} />;

      case "SHIPPED":
        return <Truck size={17} />;

      case "DELIVERED":
        return <CheckCircle size={17} />;

      case "CANCELLED":
        return <XCircle size={17} />;

      default:
        return <Package size={17} />;
    }
  };

  /* =====================================================
       STATUS MESSAGE
    ===================================================== */

  const getStatusMessage = (status) => {
    switch (status) {
      case "PLACED":
        return "Your order has been placed successfully.";

      case "CONFIRMED":
        return "Your order has been confirmed by the seller.";

      case "SHIPPED":
        return "Your order is on the way.";

      case "DELIVERED":
        return "Your order has been delivered.";

      case "CANCELLED":
        return "This order has been cancelled.";

      default:
        return "Your order is being processed.";
    }
  };

  /* =====================================================
       LOADING
    ===================================================== */

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="loader"></div>

        <h3>Loading order...</h3>
      </div>
    );
  }

  /* =====================================================
       ERROR
    ===================================================== */

  if (error || !order) {
    return (
      <div className="order-details-error">
        <div className="order-error-icon">⚠️</div>

        <h2>Unable to load order</h2>

        <p>{error || "Order not found."}</p>

        <Link to="/orders" className="back-orders-btn">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
      </div>
    );
  }

  /* =====================================================
       ORDER DATA
    ===================================================== */

  const items = order.items || [];

  const totalAmount = Number(order.totalAmount || 0);

  const status = order.status || "PLACED";

  /* =====================================================
       ORDER ID
       Supports both id and orderId
    ===================================================== */

  const displayOrderId = order.id ?? order.orderId ?? orderId;

  /* =====================================================
       STATUS TIMELINE
    ===================================================== */

  const statuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

  const currentStatusIndex = statuses.indexOf(status);

  /* =====================================================
       TIMELINE DESCRIPTION
    ===================================================== */

  const getTimelineDescription = (status) => {
    switch (status) {
      case "PLACED":
        return "Order placed";

      case "CONFIRMED":
        return "Order confirmed";

      case "SHIPPED":
        return "Order shipped";

      case "DELIVERED":
        return "Order delivered";

      default:
        return "";
    }
  };

  return (
    <div className="order-details-page">
      {/* =================================================
               BACK BUTTON
            ================================================= */}

      <Link to="/orders" className="order-back-link">
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* =================================================
               ORDER HEADER
            ================================================= */}

      <section className="order-details-header">
        <div>
          <span className="section-label">ORDER DETAILS</span>

          <h1>Order #{displayOrderId}</h1>

          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className={`order-status ${getStatusClass(status)}`}>
          {getStatusIcon(status)}

          <span>{status}</span>
        </div>
      </section>

      {/* =================================================
               STATUS MESSAGE
            ================================================= */}

      <div className="order-status-message">
        {getStatusIcon(status)}

        <span>{getStatusMessage(status)}</span>
      </div>

      {/* =================================================
               ORDER TIMELINE
            ================================================= */}

      {status !== "CANCELLED" && (
        <section className="order-timeline-card">
          <h2>Order Status</h2>

          <div className="order-timeline">
            {statuses.map((timelineStatus, index) => {
              const completed = currentStatusIndex >= index;

              return (
                <div className="timeline-item" key={timelineStatus}>
                  {/* DOT */}

                  <div
                    className={`timeline-dot ${completed ? "completed" : ""}`}
                  >
                    {completed ? (
                      <CheckCircle size={18} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* TEXT */}

                  <div className="timeline-content">
                    <strong>{timelineStatus}</strong>

                    <span>{getTimelineDescription(timelineStatus)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =================================================
               CANCELLED ORDER
            ================================================= */}

      {status === "CANCELLED" && (
        <section className="cancelled-order-card">
          <XCircle size={26} />

          <div>
            <h3>Order Cancelled</h3>

            <p>This order is no longer being processed.</p>
          </div>
        </section>
      )}

      {/* =================================================
               MAIN CONTENT
            ================================================= */}

      <div className="order-details-layout">
        {/* =================================================
                   ORDERED PRODUCTS
                ================================================= */}

        <section className="order-details-items">
          <div className="order-details-card">
            {/* CARD HEADER */}

            <div className="order-details-card-header">
              <h2>Ordered Products</h2>

              <span>
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* PRODUCTS */}

            <div className="order-detail-items">
              {items.length === 0 ? (
                <div className="no-order-items">No products found.</div>
              ) : (
                items.map((item, index) => {
                  const product = item.product;

                  const productName =
                    item.productName ?? product?.name ?? "Product";

                  const imageUrl = item.imageUrl ?? product?.imageUrl;

                  const price = Number(
                    item.price ?? item.productPrice ?? product?.price ?? 0,
                  );

                  const quantity = item.quantity || 1;

                  const itemTotal = price * quantity;

                  return (
                    <div className="order-detail-item" key={item.id ?? index}>
                      {/* PRODUCT IMAGE */}

                      <div className="order-detail-image">
                        {imageUrl ? (
                          <img src={imageUrl} alt={productName} />
                        ) : (
                          <span>🛍️</span>
                        )}
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="order-detail-info">
                        <h3>{productName}</h3>

                        <span>
                          ₹{price.toLocaleString("en-IN")}
                          {" × "}
                          {quantity}
                        </span>
                      </div>

                      {/* ITEM TOTAL */}

                      <strong>₹{itemTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* =================================================
                   ORDER SUMMARY
                ================================================= */}

        <aside className="order-details-summary">
          <h2>Order Summary</h2>

          <div className="order-summary-row">
            <span>Items</span>

            <strong>{items.length}</strong>
          </div>

          <div className="order-summary-row">
            <span>Status</span>

            <strong>{status}</strong>
          </div>

          <div className="order-summary-divider"></div>

          <div className="order-summary-total">
            <span>Total</span>

            <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
          </div>

          <div className="order-secure">
            <ShieldCheck size={15} />

            <span>Secure NexCart order</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;

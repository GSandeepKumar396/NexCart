import { useEffect, useState } from "react";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/customer/orders");

      setOrders(response.data || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loader"></div>

        <h3>Loading your orders...</h3>

        <p>Getting your latest purchases.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <div className="orders-error-icon">⚠️</div>

        <h2>Unable to load orders</h2>

        <p>{error}</p>

        <button onClick={fetchOrders}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* HEADER */}

      <section className="orders-header">
        <div>
          <span className="section-label">YOUR ACCOUNT</span>

          <h1>Your Orders</h1>

          <p>Track and manage your NexCart purchases.</p>
        </div>

        <div className="orders-count">
          <Package size={19} />

          <div>
            <strong>{orders.length}</strong>

            <span>Orders</span>
          </div>
        </div>
      </section>

      {/* EMPTY */}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">
            <ShoppingBag size={42} />
          </div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed an order yet. Start shopping and your purchases
            will appear here.
          </p>

          <Link to="/products" className="shop-orders-btn">
            Start Shopping
            <ChevronRight size={17} />
          </Link>
        </div>
      ) : (
        <section className="orders-list">
          {orders.map((order) => {
            /*
             * Supports the OrderResponse
             * structure we created earlier.
             */

            const orderId = order.id ?? order.orderId;

            const totalAmount = Number(order.totalAmount ?? 0);

            const status = order.status ?? "PLACED";

            const items = order.items || [];

            return (
              <div className="order-card" key={orderId}>
                {/* TOP */}

                <div className="order-card-top">
                  <div className="order-main-info">
                    <div className="order-icon">
                      <Package size={20} />
                    </div>

                    <div>
                      <span className="order-label">ORDER</span>

                      <h2>#{orderId}</h2>
                    </div>
                  </div>

                  <div className={`order-status ${getStatusClass(status)}`}>
                    {getStatusIcon(status)}

                    <span>{status}</span>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="order-meta">
                  <div>
                    <span>Ordered on</span>

                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>

                  <div>
                    <span>Items</span>

                    <strong>{items.length}</strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {/* ITEMS PREVIEW */}

                {items.length > 0 && (
                  <div className="order-items-preview">
                    {items.slice(0, 3).map((item, index) => {
                      const product = item.product;

                      const productName =
                        item.productName ?? product?.name ?? "Product";

                      const quantity = item.quantity ?? 1;

                      return (
                        <div
                          className="order-preview-item"
                          key={item.id ?? index}
                        >
                          <div className="order-preview-image">
                            {product?.imageUrl ? (
                              <img src={product.imageUrl} alt={productName} />
                            ) : (
                              <span>🛍️</span>
                            )}
                          </div>

                          <div>
                            <strong>{productName}</strong>

                            <span>Qty: {quantity}</span>
                          </div>
                        </div>
                      );
                    })}

                    {items.length > 3 && (
                      <span className="more-items">
                        +{items.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* FOOTER */}

                <div className="order-card-footer">
                  <span>
                    {status === "DELIVERED"
                      ? "Order delivered successfully"
                      : status === "CANCELLED"
                        ? "This order was cancelled"
                        : "Your order is being processed"}
                  </span>

                  <Link to={`/orders/${orderId}`} className="view-order-btn">
                    View Order
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default Orders;

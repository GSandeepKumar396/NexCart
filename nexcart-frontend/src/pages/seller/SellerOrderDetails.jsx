import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import api from "../../services/api";

const SellerOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/seller/orders/${orderId}`);

      setOrder(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load order.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Get only valid next statuses
  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "PLACED":
        return ["PLACED", "CONFIRMED", "CANCELLED"];

      case "CONFIRMED":
        return ["CONFIRMED", "SHIPPED", "CANCELLED"];

      case "SHIPPED":
        return ["SHIPPED", "DELIVERED"];

      case "DELIVERED":
        return ["DELIVERED"];

      case "CANCELLED":
        return ["CANCELLED"];

      default:
        return [currentStatus];
    }
  };

  const handleStatusUpdate = async () => {
    if (!status || status === order.status) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      await api.put(`/api/seller/orders/${orderId}/status`, {
        status: status,
      });

      setOrder((prev) => ({
        ...prev,
        status: status,
      }));

      setSuccess("Order status updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to update order status.";

      setError(message);

      setStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (currentStatus) => {
    switch (currentStatus) {
      case "PLACED":
        return <Clock size={20} />;

      case "CONFIRMED":
        return <CheckCircle size={20} />;

      case "SHIPPED":
        return <Truck size={20} />;

      case "DELIVERED":
        return <CheckCircle size={20} />;

      case "CANCELLED":
        return <XCircle size={20} />;

      default:
        return <Package size={20} />;
    }
  };

  const getStatusClass = (currentStatus) => {
    switch (currentStatus) {
      case "PLACED":
        return "seller-status seller-status-placed";

      case "CONFIRMED":
        return "seller-status seller-status-confirmed";

      case "SHIPPED":
        return "seller-status seller-status-shipped";

      case "DELIVERED":
        return "seller-status seller-status-delivered";

      case "CANCELLED":
        return "seller-status seller-status-cancelled";

      default:
        return "seller-status";
    }
  };

  if (loading) {
    return (
      <div className="seller-page">
        <div className="seller-loading">Loading order...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="seller-page">
        <div className="seller-container">
          <div className="seller-form-error">{error}</div>

          <button
            className="seller-secondary-btn"
            onClick={() => navigate("/seller/orders")}
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const availableStatuses = getAvailableStatuses(order.status);

  const isFinalStatus =
    order.status === "DELIVERED" || order.status === "CANCELLED";

  return (
    <div className="seller-page">
      <div className="seller-container">
        {/* Back */}
        <Link to="/seller/orders" className="seller-back-link">
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="seller-header seller-order-header">
          <div>
            <span className="seller-eyebrow">ORDER MANAGEMENT</span>

            <h1>Order #{order.orderId}</h1>

            <p>Review the order and update its fulfillment status.</p>
          </div>

          <div className="seller-order-status-display">
            {getStatusIcon(order.status)}

            <span className={getStatusClass(order.status)}>{order.status}</span>
          </div>
        </div>

        {/* Error */}
        {error && <div className="seller-form-error">{error}</div>}

        {/* Success */}
        {success && <div className="seller-form-success">{success}</div>}

        <div className="seller-order-grid">
          {/* Order Information */}
          <div className="seller-order-card">
            <div className="seller-order-card-header">
              <div>
                <span className="seller-card-eyebrow">ORDER</span>

                <h2>Order #{order.orderId}</h2>
              </div>

              <Package size={24} />
            </div>

            <div className="seller-order-info">
              <div>
                <span>Order Date</span>

                <strong>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </strong>
              </div>

              <div>
                <span>Order Status</span>

                <strong>{order.status}</strong>
              </div>

              <div>
                <span>Total Amount</span>

                <strong className="seller-order-total">
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="seller-order-card">
            <div className="seller-order-card-header">
              <div>
                <span className="seller-card-eyebrow">FULFILLMENT</span>

                <h2>Update Status</h2>
              </div>

              <Truck size={24} />
            </div>

            <div className="seller-status-form">
              <label>Order Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={updating || isFinalStatus}
              >
                {availableStatuses.map((availableStatus) => (
                  <option key={availableStatus} value={availableStatus}>
                    {availableStatus}
                  </option>
                ))}
              </select>

              <button
                className="seller-primary-btn"
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status || isFinalStatus}
              >
                {updating ? "Updating..." : "Update Status"}
              </button>

              {isFinalStatus && (
                <p className="seller-status-locked">
                  This order has reached a final status and cannot be changed.
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="seller-order-card seller-order-items-card">
            <div className="seller-order-card-header">
              <div>
                <span className="seller-card-eyebrow">ORDER ITEMS</span>

                <h2>Products</h2>
              </div>

              <Package size={24} />
            </div>

            <div className="seller-order-items">
              {order.items?.map((item) => (
                <div className="seller-order-item" key={item.productId}>
                  <div className="seller-order-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} />
                    ) : (
                      <Package size={25} />
                    )}
                  </div>

                  <div className="seller-order-item-info">
                    <h3>{item.productName}</h3>

                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <div className="seller-order-item-price">
                    <span>
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </span>

                    <small>× {item.quantity}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;

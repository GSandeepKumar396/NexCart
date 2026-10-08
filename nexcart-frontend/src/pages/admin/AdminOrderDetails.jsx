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

const AdminOrderDetails = () => {
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

      /*
       * AdminOrderController currently provides:
       * GET /api/admin/orders
       *
       * It does not provide:
       * GET /api/admin/orders/{orderId}
       *
       * Therefore we fetch all orders and find the
       * requested order on the frontend.
       */

      const response = await api.get("/api/admin/orders");

      const foundOrder = response.data.find(
        (item) => String(item.orderId) === String(orderId),
      );

      if (!foundOrder) {
        setError("Order not found.");
        return;
      }

      setOrder(foundOrder);
      setStatus(foundOrder.status);
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

      await api.put(`/api/admin/orders/${orderId}/status`, {
        status: status,
      });

      setOrder((previousOrder) => ({
        ...previousOrder,
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
        return "admin-status admin-status-placed";

      case "CONFIRMED":
        return "admin-status admin-status-confirmed";

      case "SHIPPED":
        return "admin-status admin-status-shipped";

      case "DELIVERED":
        return "admin-status admin-status-delivered";

      case "CANCELLED":
        return "admin-status admin-status-cancelled";

      default:
        return "admin-status";
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading order...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-error">{error}</div>

          <button
            className="admin-secondary-btn"
            onClick={() => navigate("/admin/orders")}
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
    <div className="admin-page">
      <div className="admin-container">
        {/* ---------- Back Navigation ---------- */}

        <Link to="/admin/orders" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* ---------- Header ---------- */}

        <div className="admin-header admin-order-header">
          <div>
            <span className="admin-eyebrow">ORDER MANAGEMENT</span>

            <h1>Order #{order.orderId}</h1>

            <p>Review the order and manage its fulfillment status.</p>
          </div>

          <div className="admin-order-status-display">
            {getStatusIcon(order.status)}

            <span className={getStatusClass(order.status)}>{order.status}</span>
          </div>
        </div>

        {/* ---------- Messages ---------- */}

        {error && <div className="admin-error">{error}</div>}

        {success && <div className="admin-success">{success}</div>}

        {/* ---------- Order Grid ---------- */}

        <div className="admin-order-grid">
          {/* ---------- Order Summary ---------- */}

          <div className="admin-order-card">
            <div className="admin-order-card-header">
              <div>
                <span className="admin-card-eyebrow">ORDER</span>

                <h2>Order #{order.orderId}</h2>
              </div>

              <Package size={24} />
            </div>

            <div className="admin-order-info">
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

                <strong className="admin-order-total">
                  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>

          {/* ---------- Status Management ---------- */}

          <div className="admin-order-card">
            <div className="admin-order-card-header">
              <div>
                <span className="admin-card-eyebrow">FULFILLMENT</span>

                <h2>Update Status</h2>
              </div>

              <Truck size={24} />
            </div>

            <div className="admin-status-form">
              <label>Order Status</label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                disabled={updating || isFinalStatus}
              >
                {availableStatuses.map((availableStatus) => (
                  <option key={availableStatus} value={availableStatus}>
                    {availableStatus}
                  </option>
                ))}
              </select>

              <button
                className="admin-primary-btn"
                onClick={handleStatusUpdate}
                disabled={updating || status === order.status || isFinalStatus}
              >
                {updating ? "Updating..." : "Update Status"}
              </button>

              {isFinalStatus && (
                <p className="admin-status-locked">
                  This order has reached a final status and cannot be changed.
                </p>
              )}
            </div>
          </div>

          {/* ---------- Order Items ---------- */}

          <div className="admin-order-card admin-order-items-card">
            <div className="admin-order-card-header">
              <div>
                <span className="admin-card-eyebrow">ORDER ITEMS</span>

                <h2>Products</h2>
              </div>

              <Package size={24} />
            </div>

            <div className="admin-order-items">
              {order.items?.map((item) => (
                <div className="admin-order-item" key={item.productId}>
                  <div className="admin-order-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} />
                    ) : (
                      <Package size={25} />
                    )}
                  </div>

                  <div className="admin-order-item-info">
                    <h3>{item.productName}</h3>

                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <div className="admin-order-item-price">
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

export default AdminOrderDetails;

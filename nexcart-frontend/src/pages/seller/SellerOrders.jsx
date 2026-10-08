import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Package, RefreshCw } from "lucide-react";
import api from "../../services/api";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/seller/orders");

      setOrders(response.data);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load orders.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
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

  // Loading state
  if (loading) {
    return (
      <div className="seller-page">
        <div className="seller-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="seller-container">
        {/* Header */}
        <div className="seller-header">
          <div>
            <span className="seller-eyebrow">SELLER CENTER</span>

            <h1>Orders</h1>

            <p>View and manage orders containing your products.</p>
          </div>

          <button className="seller-secondary-btn" onClick={fetchOrders}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && <div className="seller-form-error">{error}</div>}

        {/* Empty state */}
        {!error && orders.length === 0 && (
          <div className="seller-empty">
            <Package size={42} />

            <h2>No orders yet</h2>

            <p>Orders containing your products will appear here.</p>
          </div>
        )}

        {/* Orders table */}
        {orders.length > 0 && (
          <div className="seller-orders-table-wrapper">
            <table className="seller-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    {/* Order ID */}
                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>

                    {/* Date */}
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Items */}
                    <td>{order.items?.length || 0}</td>

                    {/* Total */}
                    <td>
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={getStatusClass(order.status)}>
                        {order.status}
                      </span>
                    </td>

                    {/* View */}
                    <td>
                      <Link
                        to={`/seller/orders/${order.orderId}`}
                        className="seller-view-btn"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

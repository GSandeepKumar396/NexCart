import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShoppingBag, Search, Eye } from "lucide-react";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/orders");

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

  const filteredOrders = orders.filter((order) => {
    const searchText = search.trim().toLowerCase();

    const orderId = String(order.orderId || "").toLowerCase();
    const status = String(order.status || "").toLowerCase();

    return orderId.includes(searchText) || status.includes(searchText);
  });

  const getStatusClass = (status) => {
    switch (status) {
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
        <div className="admin-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* ---------- Back Navigation ---------- */}

        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* ---------- Header ---------- */}

        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">ORDER MANAGEMENT</span>

            <h1>Orders</h1>

            <p>Monitor and manage all customer orders.</p>
          </div>

          <button className="admin-secondary-btn" onClick={fetchOrders}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* ---------- Error ---------- */}

        {error && <div className="admin-error">{error}</div>}

        {/* ---------- Search ---------- */}

        <div className="admin-orders-toolbar">
          <div className="admin-orders-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by order ID or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-orders-count">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ---------- Empty State ---------- */}

        {filteredOrders.length === 0 ? (
          <div className="admin-empty">
            <ShoppingBag size={40} />

            <h3>{search ? "No orders found" : "No orders yet"}</h3>

            <p>
              {search
                ? "Try a different search."
                : "Customer orders will appear here."}
            </p>
          </div>
        ) : (
          /* ---------- Orders Table ---------- */

          <div className="admin-orders-management-wrapper">
            <table className="admin-orders-management-table">
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
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    {/* ---------- Order ---------- */}

                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>

                    {/* ---------- Date ---------- */}

                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    {/* ---------- Items ---------- */}

                    <td>{order.items?.length || 0}</td>

                    {/* ---------- Total ---------- */}

                    <td>
                      <strong>
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* ---------- Status ---------- */}

                    <td>
                      <span className={getStatusClass(order.status)}>
                        {order.status}
                      </span>
                    </td>

                    {/* ---------- Action ---------- */}

                    <td>
                      <Link
                        to={`/admin/orders/${order.orderId}`}
                        className="admin-view-btn"
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

export default AdminOrders;

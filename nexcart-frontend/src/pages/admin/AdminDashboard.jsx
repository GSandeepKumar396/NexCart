import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, productsResponse, ordersResponse] =
        await Promise.all([
          api.get("/api/admin/users"),
          api.get("/api/admin/products"),
          api.get("/api/admin/orders"),
        ]);

      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load admin dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenue = () => {
    return orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0,
    );
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">ADMIN CENTER</span>

            <h1>Dashboard</h1>

            <p>Manage users, products and orders across NexCart.</p>
          </div>

          <button className="admin-secondary-btn" onClick={fetchDashboardData}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && <div className="admin-error">{error}</div>}

        {/* Statistics */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Users size={23} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Package size={23} />
            </div>

            <div>
              <span>Total Products</span>
              <strong>{products.length}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ShoppingBag size={23} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <ShieldCheck size={23} />
            </div>

            <div>
              <span>Total Revenue</span>

              <strong>₹{calculateRevenue().toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        {/* Management cards */}
        <div className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">MANAGEMENT</span>

              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-management-grid">
            <Link to="/admin/users" className="admin-management-card">
              <div className="admin-management-icon">
                <Users size={25} />
              </div>

              <div>
                <h3>User Management</h3>

                <p>View users and manage their roles.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/admin/products" className="admin-management-card">
              <div className="admin-management-icon">
                <Package size={25} />
              </div>

              <div>
                <h3>Product Management</h3>

                <p>Review and manage marketplace products.</p>
              </div>

              <ArrowRight size={19} />
            </Link>

            <Link to="/admin/orders" className="admin-management-card">
              <div className="admin-management-icon">
                <ShoppingBag size={25} />
              </div>

              <div>
                <h3>Order Management</h3>

                <p>Monitor and manage all customer orders.</p>
              </div>

              <ArrowRight size={19} />
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">RECENT ACTIVITY</span>

              <h2>Recent Orders</h2>
            </div>

            <Link to="/admin/orders" className="admin-section-link">
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">
              <ShoppingBag size={40} />

              <h3>No orders yet</h3>

              <p>Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="admin-orders-table-wrapper">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.orderId}>
                      <td>
                        <strong>#{order.orderId}</strong>
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>{order.items?.length || 0}</td>

                      <td>
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span
                          className={`admin-status admin-status-${String(
                            order.status,
                          ).toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

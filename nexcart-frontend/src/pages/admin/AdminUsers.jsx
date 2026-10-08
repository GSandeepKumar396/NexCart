import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Users, Trash2, ShieldCheck } from "lucide-react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUser, setUpdatingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load users.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUser(userId);
      setError("");

      await api.put(`/api/admin/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to update user role.";

      setError(message);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUser(userId);
      setError("");

      await api.delete(`/api/admin/users/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== userId),
      );
    } catch (error) {
      console.error(error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to delete user.";

      setError(message);
    } finally {
      setDeletingUser(null);
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "ADMIN":
        return "admin-role admin-role-admin";

      case "SELLER":
        return "admin-role admin-role-seller";

      case "CUSTOMER":
        return "admin-role admin-role-customer";

      default:
        return "admin-role";
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading users...</div>
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
            <span className="admin-eyebrow">USER MANAGEMENT</span>

            <h1>Users</h1>

            <p>View users and manage their roles.</p>
          </div>

          <button className="admin-secondary-btn" onClick={fetchUsers}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* ---------- Error ---------- */}

        {error && <div className="admin-error">{error}</div>}

        {/* ---------- User Count ---------- */}

        <div className="admin-users-summary">
          <div className="admin-users-summary-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        {/* ---------- Users Table ---------- */}

        {users.length === 0 ? (
          <div className="admin-empty">
            <Users size={40} />

            <h3>No users found</h3>

            <p>Registered users will appear here.</p>
          </div>
        ) : (
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>#{user.id}</strong>
                    </td>

                    <td>
                      <div className="admin-user-name">
                        <div className="admin-user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <span>{user.name}</span>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className={getRoleClass(user.role)}>
                        <ShieldCheck size={14} />
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <div className="admin-user-actions">
                        {/* ---------- Role ---------- */}

                        <select
                          value={user.role}
                          disabled={updatingUser === user.id}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value)
                          }
                        >
                          <option value="CUSTOMER">CUSTOMER</option>

                          <option value="SELLER">SELLER</option>

                          <option value="ADMIN">ADMIN</option>
                        </select>

                        {/* ---------- Delete ---------- */}

                        <button
                          className="admin-delete-btn"
                          disabled={deletingUser === user.id}
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          <Trash2 size={16} />

                          {deletingUser === user.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
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

export default AdminUsers;

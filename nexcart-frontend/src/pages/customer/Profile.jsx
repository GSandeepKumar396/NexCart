import { useEffect, useState } from "react";

import {
  User,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  LogOut,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");

      return;
    }

    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/api/users/me");

      setUser(response.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>

        <h3>Loading profile...</h3>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-error">
        <div>⚠️</div>

        <h2>Unable to load profile</h2>

        <p>{error || "User not found."}</p>

        <button onClick={fetchProfile}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* =================================================
               HEADER
            ================================================= */}

      <section className="profile-header">
        <span className="section-label">MY ACCOUNT</span>

        <h1>Profile</h1>

        <p>Manage your NexCart account and view your account information.</p>
      </section>

      {/* =================================================
               PROFILE CONTENT
            ================================================= */}

      <div className="profile-layout">
        {/* =================================================
                   PROFILE CARD
                ================================================= */}

        <section className="profile-card">
          <div className="profile-card-top">
            {/* AVATAR */}

            <div className="profile-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2>{user.name}</h2>

              <span className="profile-role">{user.role}</span>
            </div>
          </div>

          {/* DETAILS */}

          <div className="profile-details">
            <div className="profile-detail">
              <div className="profile-detail-icon">
                <User size={18} />
              </div>

              <div>
                <span>Full Name</span>

                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <div className="profile-detail-icon">
                <Mail size={18} />
              </div>

              <div>
                <span>Email Address</span>

                <strong>{user.email}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <div className="profile-detail-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <span>Account Role</span>

                <strong>{user.role}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
                   QUICK ACTIONS
                ================================================= */}

        <section className="profile-actions-card">
          <h2>Quick Actions</h2>

          <Link to="/orders" className="profile-action">
            <div className="profile-action-icon">
              <ShoppingBag size={20} />
            </div>

            <div>
              <strong>My Orders</strong>

              <span>View your order history</span>
            </div>

            <ArrowRight size={18} />
          </Link>

          <Link to="/cart" className="profile-action">
            <div className="profile-action-icon">
              <ShoppingCart size={20} />
            </div>

            <div>
              <strong>My Cart</strong>

              <span>View your selected products</span>
            </div>

            <ArrowRight size={18} />
          </Link>

          <button className="profile-logout" onClick={handleLogout}>
            <LogOut size={19} />
            Logout
          </button>
        </section>
      </div>

      {/* =================================================
               SECURITY
            ================================================= */}

      <div className="profile-security">
        <ShieldCheck size={20} />

        <div>
          <strong>Your account is secure</strong>

          <span>NexCart protects your account using authenticated access.</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

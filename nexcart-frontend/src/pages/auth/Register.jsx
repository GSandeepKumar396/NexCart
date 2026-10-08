import { useState } from "react";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

const Register = () => {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      setMessage(
        typeof response.data === "string"
          ? response.data
          : "Registration successful!",
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      const responseData = error.response?.data;

      let errorMessage = "Registration failed. Please try again.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (error.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* =================================================
               LEFT SIDE
            ================================================= */}

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            Nex<span>Cart</span>
          </div>

          <h1>
            Your shopping
            <br />
            journey starts here.
          </h1>

          <p>
            Create your NexCart account and discover products from trusted
            sellers.
          </p>

          <div className="auth-feature">
            <ShieldCheck size={20} />

            <div>
              <strong>Secure Account</strong>

              <span>
                Your personal information is protected with secure
                authentication.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
               RIGHT SIDE
            ================================================= */}

      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* HEADER */}

          <div className="auth-form-header">
            <span className="auth-mobile-brand">
              Nex<span>Cart</span>
            </span>

            <h2>Create your account</h2>

            <p>Join NexCart and start shopping today.</p>
          </div>

          {/* FORM */}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* NAME */}

            <div className="auth-input-group">
              <label htmlFor="name">Full Name</label>

              <div className="auth-input-wrapper">
                <User size={18} />

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="auth-input-group">
              <label htmlFor="email">Email Address</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>

              <div className="auth-input-wrapper password-input-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <span className="auth-input-hint">
                Password must contain at least 6 characters.
              </span>
            </div>

            {/* SUCCESS */}

            {message && <div className="auth-success">{message}</div>}

            {/* ERROR */}

            {error && <div className="auth-error">{error}</div>}

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}

          <div className="auth-switch">
            <span>Already have an account?</span>

            <Link to="/login">Sign in</Link>
          </div>

          {/* SECURITY */}

          <div className="auth-security">
            <ShieldCheck size={16} />

            <span>Secure authentication powered by NexCart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

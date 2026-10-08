import { useState } from "react";

import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Login
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data;

      // 2. Store JWT first
      localStorage.setItem("token", token);

      // 3. Get logged-in user's details and role
      const userResponse = await api.get("/api/users/me");

      const user = userResponse.data;

      console.log("Logged in user:", user);

      // 4. Store role
      localStorage.setItem("role", user.role);

      // 5. Update AuthContext
      login(token, user.role);

      // 6. Go to home
      navigate("/");
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      let errorMessage = "Login failed. Please check your credentials.";

      if (typeof responseData === "string") {
        errorMessage = responseData;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}

      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            Nex<span>Cart</span>
          </div>

          <h1>
            Shop smarter.
            <br />
            Live better.
          </h1>

          <p>
            Discover quality products from trusted sellers, all in one place.
          </p>

          <div className="auth-feature">
            <ShieldCheck size={20} />

            <div>
              <strong>Secure Shopping</strong>

              <span>Your account is protected with secure authentication.</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* HEADER */}

          <div className="auth-form-header">
            <span className="auth-mobile-brand">
              Nex<span>Cart</span>
            </span>

            <h2>Welcome back</h2>

            <p>Sign in to continue shopping with NexCart.</p>
          </div>

          {/* FORM */}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* ERROR */}

            {error && <div className="auth-error">{error}</div>}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* REGISTER */}

          <div className="auth-switch">
            <span>Don't have an account?</span>

            <Link to="/register">Create an account</Link>
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

export default Login;

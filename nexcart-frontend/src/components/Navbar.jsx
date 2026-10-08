import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* =====================================================
            LOGO
            ===================================================== */}

        <Link
          to={role === "ADMIN" ? "/admin" : role === "SELLER" ? "/seller" : "/"}
          className="navbar-logo"
          onClick={closeMenu}
        >
          Nex<span>Cart</span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
            ===================================================== */}

        <nav className="desktop-nav">
          {/* ---------------- CUSTOMER ---------------- */}

          {(!isAuthenticated || role === "CUSTOMER") && (
            <>
              <Link to="/">Home</Link>

              <Link to="/products">Products</Link>

              {isAuthenticated && (
                <>
                  <Link to="/orders">Orders</Link>

                  <Link to="/profile">Profile</Link>
                </>
              )}
            </>
          )}

          {/* ---------------- SELLER ---------------- */}

          {isAuthenticated && role === "SELLER" && (
            <>
              <Link to="/seller">Dashboard</Link>

              <Link to="/seller/products">My Products</Link>

              <Link to="/seller/orders">Orders</Link>
            </>
          )}

          {/* ---------------- ADMIN ---------------- */}

          {isAuthenticated && role === "ADMIN" && (
            <>
              <Link to="/admin">Dashboard</Link>

              <Link to="/admin/users">Users</Link>

              <Link to="/admin/products">Products</Link>

              <Link to="/admin/orders">Orders</Link>
            </>
          )}
        </nav>

        {/* =====================================================
            SEARCH
            ===================================================== */}

        {(!isAuthenticated || role === "CUSTOMER") && (
          <div className="navbar-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const searchValue = e.target.value.trim();

                  if (searchValue) {
                    navigate(
                      `/products?search=${encodeURIComponent(searchValue)}`,
                    );
                  }
                }
              }}
            />
          </div>
        )}

        {/* =====================================================
            ACTIONS
            ===================================================== */}

        <div className="navbar-actions">
          {/* ---------------- CUSTOMER CART ---------------- */}

          {isAuthenticated && role === "CUSTOMER" && (
            <Link to="/cart" className="nav-icon" title="Cart">
              <ShoppingCart size={21} />
            </Link>
          )}

          {/* ---------------- NOT LOGGED IN ---------------- */}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>

              <Link to="/register" className="nav-register-btn">
                Get Started
              </Link>
            </>
          )}

          {/* ---------------- LOGGED IN ---------------- */}

          {isAuthenticated && (
            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />

              <span>Logout</span>
            </button>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
            ===================================================== */}

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      {menuOpen && (
        <div className="mobile-menu">
          {/* ---------------- CUSTOMER ---------------- */}

          {(!isAuthenticated || role === "CUSTOMER") && (
            <>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>

              <Link to="/products" onClick={closeMenu}>
                Products
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/cart" onClick={closeMenu}>
                    Cart
                  </Link>

                  <Link to="/orders" onClick={closeMenu}>
                    Orders
                  </Link>

                  <Link to="/profile" onClick={closeMenu}>
                    Profile
                  </Link>
                </>
              )}
            </>
          )}

          {/* ---------------- SELLER ---------------- */}

          {isAuthenticated && role === "SELLER" && (
            <>
              <Link to="/seller" onClick={closeMenu}>
                Dashboard
              </Link>

              <Link to="/seller/products" onClick={closeMenu}>
                My Products
              </Link>

              <Link to="/seller/orders" onClick={closeMenu}>
                Orders
              </Link>
            </>
          )}

          {/* ---------------- ADMIN ---------------- */}

          {isAuthenticated && role === "ADMIN" && (
            <>
              <Link to="/admin" onClick={closeMenu}>
                Dashboard
              </Link>

              <Link to="/admin/users" onClick={closeMenu}>
                Users
              </Link>

              <Link to="/admin/products" onClick={closeMenu}>
                Products
              </Link>

              <Link to="/admin/orders" onClick={closeMenu}>
                Orders
              </Link>
            </>
          )}

          {/* ---------------- AUTH ACTIONS ---------------- */}

          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/register" onClick={closeMenu}>
                Create Account
              </Link>
            </>
          )}

          {/* ---------------- LOGOUT ---------------- */}

          {isAuthenticated && (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

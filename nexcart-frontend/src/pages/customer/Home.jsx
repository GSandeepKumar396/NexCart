import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard,
  Sparkles,
} from "lucide-react";

import api from "../../services/api";
import ProductCard from "../../components/product/ProductCard";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // ROLE-BASED REDIRECT
  // =====================================================

  if (isAuthenticated && role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && role === "SELLER") {
    return <Navigate to="/seller" replace />;
  }

  // =====================================================
  // LOAD FEATURED PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products", {
          params: {
            page: 0,
            size: 8,
          },
        });

        setProducts(response.data.content || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>India's modern multi-vendor marketplace</span>
          </div>

          <h1>
            Shop smarter.
            <span> Live better.</span>
          </h1>

          <p>
            Discover products from trusted sellers, compare your favorites, and
            get everything you need in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="primary-btn">
              Explore Products
              <ArrowRight size={18} />
            </Link>

            {!isAuthenticated && (
              <Link to="/register" className="secondary-btn">
                Create Account
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div>
              <strong>10K+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Sellers</span>
            </div>

            <div>
              <strong>50K+</strong>
              <span>Customers</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle"></div>

          <div className="floating-card card-one">
            <span>⚡</span>

            <div>
              <strong>Fast Delivery</strong>
              <small>Quick & reliable</small>
            </div>
          </div>

          <div className="floating-card card-two">
            <span>🛍️</span>

            <div>
              <strong>Great Products</strong>
              <small>From trusted sellers</small>
            </div>
          </div>

          <div className="hero-shopping-bag">🛍️</div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
          ===================================================== */}

      <section className="features-section">
        <div className="feature-item">
          <div className="feature-icon">
            <Truck size={22} />
          </div>

          <div>
            <h3>Fast Delivery</h3>
            <p>Quick delivery to your doorstep</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h3>Secure Shopping</h3>
            <p>Your data stays protected</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <CreditCard size={22} />
          </div>

          <div>
            <h3>Easy Payments</h3>
            <p>Simple and secure checkout</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <Headphones size={22} />
          </div>

          <div>
            <h3>Customer Support</h3>
            <p>We're here when you need us</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
          ===================================================== */}

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE</span>

            <h2>Shop by Category</h2>
          </div>

          <Link to="/products">
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="category-grid">
          <Link
            to="/products?category=Electronics"
            className="category-card electronics"
          >
            <div className="category-icon">💻</div>

            <div>
              <h3>Electronics</h3>
              <p>Latest gadgets & devices</p>
            </div>

            <ArrowRight size={20} />
          </Link>

          <Link
            to="/products?category=Fashion"
            className="category-card fashion"
          >
            <div className="category-icon">👕</div>

            <div>
              <h3>Fashion</h3>
              <p>Style for every occasion</p>
            </div>

            <ArrowRight size={20} />
          </Link>

          <Link to="/products?category=Home" className="category-card home">
            <div className="category-icon">🏠</div>

            <div>
              <h3>Home</h3>
              <p>Make your space better</p>
            </div>

            <ArrowRight size={20} />
          </Link>

          <Link to="/products?category=Books" className="category-card books">
            <div className="category-icon">📚</div>

            <div>
              <h3>Books</h3>
              <p>Learn, explore & discover</p>
            </div>

            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
          ===================================================== */}

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">TRENDING NOW</span>

            <h2>Featured Products</h2>
          </div>

          <Link to="/products">
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-products">
            <div className="loader"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h3>No products available</h3>

            <p>Products will appear here once sellers add them.</p>
          </div>
        )}
      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="cta-section">
        <div>
          <span className="section-label">JOIN NEXCART</span>

          <h2>
            Ready to discover
            <br />
            something amazing?
          </h2>

          <p>
            Create your free account and start shopping from trusted sellers
            today.
          </p>
        </div>

        {!isAuthenticated && (
          <Link to="/register" className="cta-button">
            Get Started
            <ArrowRight size={18} />
          </Link>
        )}
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">
        <div className="footer-brand">
          <h2>
            Nex<span>Cart</span>
          </h2>

          <p>A modern multi-vendor e-commerce platform built for everyone.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Shop</h4>

            <Link to="/products">Products</Link>

            <Link to="/products">Categories</Link>
          </div>

          <div>
            <h4>Account</h4>

            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>

                <Link to="/register">Register</Link>
              </>
            ) : (
              <Link to="/profile">Profile</Link>
            )}
          </div>

          <div>
            <h4>Platform</h4>

            <span>For Customers</span>
            <span>For Sellers</span>
          </div>
        </div>
      </footer>

      {/* =====================================================
          FOOTER BOTTOM
          ===================================================== */}

      <div className="footer-bottom">
        <p>© 2026 NexCart. All rights reserved.</p>

        <p>Built with React + Spring Boot</p>
      </div>
    </div>
  );
};

export default Home;

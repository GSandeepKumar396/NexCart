import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// =====================================================
// AUTH
// =====================================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// =====================================================
// CUSTOMER
// =====================================================

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Orders from "../pages/customer/Orders";
import OrderDetails from "../pages/customer/OrderDetails";
import Profile from "../pages/customer/Profile";

// =====================================================
// SELLER
// =====================================================

import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerProductForm from "../pages/seller/SellerProductForm";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerOrderDetails from "../pages/seller/SellerOrderDetails";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =====================================================
                AUTH ROUTES
                ===================================================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =====================================================
                PUBLIC SHOPPING ROUTES
                ===================================================== */}

      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      {/* =====================================================
                CUSTOMER PROTECTED ROUTES
                ===================================================== */}

      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/orders/:orderId" element={<OrderDetails />} />

        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* =====================================================
                SELLER PROTECTED ROUTES
                ===================================================== */}

      <Route element={<ProtectedRoute allowedRoles={["SELLER"]} />}>
        <Route path="/seller" element={<SellerDashboard />} />

        <Route path="/seller/products" element={<SellerProducts />} />

        <Route path="/seller/products/new" element={<SellerProductForm />} />

        <Route
          path="/seller/products/edit/:id"
          element={<SellerProductForm />}
        />

        <Route path="/seller/orders" element={<SellerOrders />} />

        <Route
          path="/seller/orders/:orderId"
          element={<SellerOrderDetails />}
        />
      </Route>

      {/* =====================================================
                ADMIN PROTECTED ROUTES
                ===================================================== */}

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/admin/products" element={<AdminProducts />} />

        <Route path="/admin/orders" element={<AdminOrders />} />

        <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
      </Route>

      {/* =====================================================
                FALLBACK
                ===================================================== */}

      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but has the wrong role
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "SELLER") {
      return <Navigate to="/seller" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

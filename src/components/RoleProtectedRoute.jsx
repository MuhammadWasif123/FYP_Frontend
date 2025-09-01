// src/components/RoleProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Checking session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  // If user's role is not in allowedRoles, redirect to home (or show 403 page)
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleProtectedRoute;

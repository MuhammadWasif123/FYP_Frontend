import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import VerifyOtpPage from "./pages/VerifyOtpPage";

// Pages
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ReportCrimePage from "./pages/ReportCrimePage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";  // 👉 Example admin page
// import AdminReportsPage from "./pages/AdminReportsPage"; // 👉 Example admin reports page

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="" style={{ fontFamily: "Inter, sans-serif" }}>
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/verify-otp"
            element={<VerifyOtpPage />}
          />

          {/* ✅ Protected Routes (for all logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/report-crime" element={<ReportCrimePage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            
          </Route>

          {/* ✅ Admin-only Routes (extra protection with role check) */}
          <Route
            element={<RoleProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/admin/reports" element={<AdminReportsPage />} /> */}
          </Route>

          {/* ✅ Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

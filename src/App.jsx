import React from "react";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route, Navigate } from "react-router";
import ReportCrimePage from "./pages/ReportCrimePage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="" style={{ fontFamily: "Inter, sans-serif" }}>
        <Routes>
          {/* General Home Page Route for Every User */}
          <Route path="/" element={<HomePage />} />

          {/* These are the Guest User Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
           <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />

          {/* Protected Route For the */}
          <Route
            path="/report-crime"
            element={
              <ProtectedRoute>
                <ReportCrimePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;

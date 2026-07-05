// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CanvasEditor from "./pages/CanvasEditor";
import ProjectList from "./pages/ProjectList";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

/**
 * Wraps protected routes — redirects to /login if not authenticated.
 * Uses Redux auth state (hydrated from localStorage on app start).
 */
function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/**
 * Wraps auth routes — redirects to / if already authenticated.
 * Prevents logged-in users from accessing /login or /register.
 */
function PublicRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Landing />} />

        {/* ===== Public Auth Routes ===== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ===== Protected App Routes ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/canvas/:projectId" element={<CanvasEditor />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

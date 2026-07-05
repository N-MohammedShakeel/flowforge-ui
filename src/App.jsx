import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CanvasEditor from "./pages/CanvasEditor";
import ProjectList from "./pages/ProjectList";
import Login from "./pages/Auth/Login";

function App() {
  const isAuthenticated = true; // Replace with real auth logic from Redux later

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/projects"
          element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />}
        />

        <Route
          path="/canvas/:projectId"
          element={
            isAuthenticated ? <CanvasEditor /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

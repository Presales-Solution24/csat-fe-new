// src/App.js

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectSatisfactionPage from "./pages/ProjectSatisfactionForm";
import ProjectSatisfactionList from "./pages/ProjectSatisfactionList";
import ProjectScoringForm from "./pages/ProjectScoringForm";
import ProjectReviewPDF from "./pages/ProjectReviewPDF";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-satisfaction"
        element={
          <ProtectedRoute>
            <ProjectSatisfactionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-satisfaction/edit"
        element={
          <ProtectedRoute>
            <ProjectSatisfactionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-satisfaction-list"
        element={
          <ProtectedRoute>
            <ProjectSatisfactionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-scoring"
        element={
          <ProtectedRoute>
            <ProjectScoringForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project-review-pdf"
        element={
          <ProtectedRoute>
            <ProjectReviewPDF />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

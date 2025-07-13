import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectSatisfactionPage from "./pages/ProjectSatisfactionForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
    </Routes>
  );
}

export default App;

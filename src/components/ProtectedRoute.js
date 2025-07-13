import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

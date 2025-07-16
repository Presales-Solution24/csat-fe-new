import React from "react";
import { Navigate } from "react-router-dom";

// Fungsi untuk memeriksa apakah user sudah login
const isAuthenticated = () => {
  // Ganti "token" sesuai dengan nama key yang Anda simpan di localStorage
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika sudah login, tampilkan komponen anak (protected page)
  return children;
};

export default ProtectedRoute;

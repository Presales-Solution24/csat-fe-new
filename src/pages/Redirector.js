// src/pages/Redirector.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; // ✅ opsional (gunakan jika ingin cek expired)

export default function Redirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;
        console.log(decoded.exp)
        if (decoded.exp && decoded.exp > now) {
          navigate("/dashboard");
        } else {
          localStorage.removeItem("token"); // Token expired
          navigate("/"); // Back to login
        }
      } catch (err) {
        // Jika token corrupt/tidak valid
        localStorage.removeItem("token");
        navigate("/");
      }
    } else {
      navigate("/"); // No token
    }
  }, [navigate]);

  return null;
}

// src/pages/Redirector.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/dashboard");
    } else {
      navigate("/"); // login page
    }
  }, [navigate]);

  return null;
}

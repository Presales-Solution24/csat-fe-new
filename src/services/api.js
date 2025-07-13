import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Ganti jika backend Anda berbeda
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;

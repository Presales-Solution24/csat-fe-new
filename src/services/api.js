// services/api.js
import axios from "axios";

// Untuk JSON request
export const API = axios.create({
  baseURL: "https://uat-be.solution-core.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Untuk FormData (upload Excel, dsb)
export const API_FORM = axios.create({
  baseURL: "https://uat-be.solution-core.com",
  // Jangan set Content-Type agar otomatis multipart/form-data
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // },
});

// ✅ Tambahkan default export agar tidak error di file lain
export default API;

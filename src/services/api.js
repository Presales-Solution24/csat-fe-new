import axios from "axios";

const API = axios.create({
  baseURL: "https://uat-be.solution-core.com", // Ganti jika backend Anda berbeda
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
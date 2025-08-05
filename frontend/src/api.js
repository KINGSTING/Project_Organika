import axios from "axios";

// Get base URL from environment or fallback
const API_BASE = import.meta.env.VITE_API_BASE || "https://project-organika.onrender.com";

// Create Axios instance
const API = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

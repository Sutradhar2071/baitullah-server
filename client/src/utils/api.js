import axios from "axios";

// In production set VITE_API_URL (e.g. https://your-backend.onrender.com/api)
// In local dev, leave unset - Vite proxy forwards /api to localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach admin token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401 from protected admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
    }
    return Promise.reject(error);
  }
);

export default api;

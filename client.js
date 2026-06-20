import axios from "axios";

export const api = axios.create({
  // If VITE_API_URL is not set, use same-origin "/api" (works with Vite proxy and production deployments)
  baseURL: import.meta.env.VITE_API_URL
    ? `${String(import.meta.env.VITE_API_URL).replace(/\/$/, "")}/api`
    : "/api",
  timeout: 30_000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Avoid CORS issues in dev/preview by proxying API calls through the frontend origin.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});

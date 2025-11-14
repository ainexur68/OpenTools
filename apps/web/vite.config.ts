import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../../src"),
      "#app": path.resolve(__dirname, "./src"),
      "react-router-dom": path.resolve(__dirname, "../../src/vendor/react-router-dom")
    }
  },
  server: {
    port: 5173
  }
});

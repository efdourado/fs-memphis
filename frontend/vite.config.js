import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        secure: false,
  }, }, },
  build: {
    target: "esnext",
}, });
import env from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import process from "node:process";

// Load environment variables
env.config({
  path: path.resolve(process.cwd(), ".env"),
  debug: process.env.NODE_ENV === "development",
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
    // Optimize build output
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ai: ["@google/generative-ai"],
        },
      },
    },
    // Enable source maps for better debugging
    sourcemap: process.env.NODE_ENV === "development",
  },
  server: {
    // Allow access from local network devices
    host: true,
    port: 3000,
    // Enable CORS for development
    cors: true,
    // Auto-open browser in development
    open: process.env.NODE_ENV === "development",
  },
  // Only include markdown files as assets, exclude node_modules
  assetsInclude: ["**/*.md"],
  // Use relative paths for GitHub Pages compatibility
  base: "./",
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "@google/generative-ai"],
  },
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "0.0.0"),
  },
});

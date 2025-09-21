import env from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import process from "node:process";

env.config({
  path: path.resolve(process.cwd(), ".env"),
  debug: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  assetsInclude: ["**/*.md", "node_modules"],

  base: "./", // Use relative paths for assets for GitHub Pages compatibility
});

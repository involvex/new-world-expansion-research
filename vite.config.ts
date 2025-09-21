import env  from 'dotenv';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';
import process from 'node:process';

env.config({
  path: path.resolve(process.cwd(), '.env'),
  debug: true
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  assetsInclude: ['**/*.md', 'node_modules'],
  
  base: './', // Use relative paths for assets for GitHub Pages compatibility
})

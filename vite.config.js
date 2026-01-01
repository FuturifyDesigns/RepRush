import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use environment variable to switch between local and production
  // Local dev: base = '/'
  // GitHub Pages: base = '/RepRush/'
  base: process.env.NODE_ENV === 'production' ? '/RepRush/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})

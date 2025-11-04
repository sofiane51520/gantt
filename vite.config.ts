import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        enabled: process.env.NODE_ENV === 'development', // Only enable in development
        buildMode: true, // Ensure it runs during build in development
      }}
],
  base: '/gantt/', // 👈 important for GitHub Pages
})

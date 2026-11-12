import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: process.env.KINEMO_BACKEND_URL ? 'node_modules/.vite-integration' : 'node_modules/.vite',
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.KINEMO_BACKEND_URL || 'http://localhost:5089',
        changeOrigin: true,
      },
    },
  },
})

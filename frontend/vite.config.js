import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000', // Redirects API calls to the backend

      
    },
    optimizeDeps: {
      include: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
    },
  },
})

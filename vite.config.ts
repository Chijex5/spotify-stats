import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',         // Bind to 127.0.0.1 instead of default
    port: 5173,                // Optional: choose a fixed port
    strictPort: true,          // Error if port is already used
    origin: 'http://127.0.0.1:5173', // Helps with correct CSPs/URLs
  },
  plugins: [react()],
})

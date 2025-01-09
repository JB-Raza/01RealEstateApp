import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // we created server so that we could send request to backend through react and we dont have to write complete URL every time.
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
      }
    }
  },
  plugins: [react()],
})

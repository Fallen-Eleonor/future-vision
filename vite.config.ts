import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Позволяет Railway получить доступ к приложению
    port: process.env.PORT || 5173,
  },
  preview: {
    host: true,
    port: process.env.PORT || 5173,
  }
})
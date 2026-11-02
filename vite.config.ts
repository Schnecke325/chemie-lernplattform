import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/chemie-lernplattform/',
  plugins: [react()],
})

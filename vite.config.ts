import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages project site: /pro/. Set VITE_BASE_PATH=/ to run at a root domain.
  base: process.env.VITE_BASE_PATH || '/pro/',
})

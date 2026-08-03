import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base подставляется при сборке в GitHub Actions (BASE_PATH=/<repo>/)
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
})

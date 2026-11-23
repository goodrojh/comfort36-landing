import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base подставляется при сборке в GitHub Actions (BASE_PATH=/<repo>/)
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: ['index.html', 'cart.html', 'privacy.html', 'consent.html', 'thanks/index.html'] } },
  base: process.env.BASE_PATH || '/',
})

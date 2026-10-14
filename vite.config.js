import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Aktiverar React-stöd i Vite, bland annat för JSX och snabb uppdatering under utveckling.
  plugins: [react()],
  server: {
    // Skickar API-anrop från frontendens utvecklingsserver vidare till Express.
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
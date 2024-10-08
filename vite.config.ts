import { defineConfig } from 'vite';

export default defineConfig({
    base: '/LMS-frontend/',
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  });
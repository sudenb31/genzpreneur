/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'standalone' ? [viteSingleFile()] : [])],
  build: mode === 'standalone' ? { outDir: 'preview', emptyOutDir: true } : undefined,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'api/**/*.test.js'],
    setupFiles: ['./src/test/setup.ts'],
  },
}));

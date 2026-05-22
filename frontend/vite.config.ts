import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // pnpm --filter frontend runs with cwd=frontend/; monorepo .env lives at repo root
  envDir: path.resolve(__dirname, '..'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Workspace package builds to CJS; Vite needs ESM/TS source for enum exports
      '@weather-app/types': path.resolve(__dirname, '../packages/types/src/index.ts'),
    },
  },
});

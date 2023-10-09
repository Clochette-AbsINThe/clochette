import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/pages/**', 'src/openapi-codegen/**', 'src/types/**', 'src/components/ui/**'],
      all: true
    },
    env: {
      NEXT_PUBLIC_BACKEND_API_URL: 'http://localhost:8000'
    }
  }
});

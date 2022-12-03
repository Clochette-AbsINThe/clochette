import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setupTests.ts',
        coverage: {
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['src/pages/**', 'src/types/**', 'src/layouts/base.tsx', 'src/middleware.ts'],
            all: true
        },
        env: {
            NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
            NEXT_PUBLIC_BACKEND_API_URL: 'https://clochette.dev/api/v1'
        }
    }
});

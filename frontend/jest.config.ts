import type { Config } from 'jest';

const config: Config = {
    moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@layouts/(.*)$': '<rootDir>/src/layouts/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
        '^@include/(.*)$': '<rootDir>/src/layouts/include/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@proxies/(.*)$': '<rootDir>/src/proxies/$1',
        '^@types': '<rootDir>/src/types/types.ts',
        '^@endpoints': '<rootDir>/src/types/endpoints.ts'
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}'
    ],
    coverageDirectory: 'coverage'
};

export default config;

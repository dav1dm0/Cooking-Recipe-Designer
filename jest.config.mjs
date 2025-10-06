import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Point to the new .ts setup file
    preset: 'ts-jest',
    moduleNameMapper: {
        // Handle CSS imports
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

        '^@/lib/(.*)$': '<rootDir>/lib/$1',
        // Handle module aliases
        '^@/(.*)$': '<rootDir>/$1',
    },
};

export default createJestConfig(config);
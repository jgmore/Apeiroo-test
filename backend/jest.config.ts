import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
};

export default config;

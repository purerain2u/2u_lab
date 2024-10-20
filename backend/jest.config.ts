import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
        '^@/lib/(.*)$': '<rootDir>/lib/$1',
        '^@/types/(.*)$': '<rootDir>/types/$1',
        '^@/server/(.*)$': '<rootDir>/server/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: [
        '**/__tests__/**/*.ts?(x)',
        '**/?(*.)+(spec|test).ts?(x)',
        '**/tests/**/*.ts?(x)',
        '**/__tests__/**/*.js?(x)',
        '**/?(*.)+(spec|test).js?(x)'
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json'
        }]
    },
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    },
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/.next/'
    ],
    verbose: true
};

export default config;

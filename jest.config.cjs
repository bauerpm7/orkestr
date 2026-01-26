module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/dist/'],
  moduleNameMapper: {
    '^@orkestr/core(.*)$': '<rootDir>/packages/core/src$1',
    '^@orkestr/diagrams(.*)$': '<rootDir>/packages/diagrams/src$1',
    '^@orkestr/targets-temporal(.*)$': '<rootDir>/packages/targets/temporal/src$1',
  },
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};

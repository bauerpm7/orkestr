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
};

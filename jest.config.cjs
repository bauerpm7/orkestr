module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/dist/'],
  moduleNameMapper: {
    '^@orkestr/core(.*)$': '<rootDir>/packages/core/src$1',
  },
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/test/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: './out',
  coverageReporters: ['text', 'html'],
};
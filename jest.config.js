module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};

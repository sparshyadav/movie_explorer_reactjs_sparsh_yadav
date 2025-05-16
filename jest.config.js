export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true, 
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/path/to/ignore/",
    "src/API.ts",
  ],
};

export default {
  preset: 'ts-jest',
  testRegex: '\\.test\\.ts$',
  setupFilesAfterEnv: ['./src/tests/jest.setup.ts'],
};

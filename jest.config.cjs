module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleFileExtensions: [
    'ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'
  ],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  }
};

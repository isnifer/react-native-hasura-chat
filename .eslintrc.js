module.exports = {
  extends: '@detools/eslint-config',
  globals: {
    jest: false,
    describe: false,
    it: false,
    test: false,
    expect: false,
    beforeAll: false,
    beforeEach: false,
    afterAll: false,
    afterEach: false,
  },
  rules: {
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'react/prop-types': 'off',
  },
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    indent: ['off', 2],
    'linebreak-style': ['off', 'unix'],
    quotes: ['off', 'single'],
    semi: ['off', 'always'],
  },
};

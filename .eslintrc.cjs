module.exports = {
  root: true,
  env: {
    browser: false,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vitest'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'local',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: false,
      },
    ],
  },
};

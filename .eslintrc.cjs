module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  plugins: ['vitest'],
  ignorePatterns: ['**/node_modules/*', '**/dist/*'],
  overrides: [
    {
      files: ['*.{js,ts}'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json', './tests/*/tsconfig.json'],
  },
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'local',
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: false,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'vitest',
            importNames: ['expect'],
            message: 'Use the `expect` from the test context instead.',
          },
        ],
      },
    ],
  },
};

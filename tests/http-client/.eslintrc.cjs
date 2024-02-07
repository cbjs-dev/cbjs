module.exports = {
  extends: ['../../.eslintrc.cjs'],
  rules: {
    'no-undef': 'off',
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

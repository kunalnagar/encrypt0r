const { FlatCompat } = require('@eslint/eslintrc');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
    parserOptions: {
      project: './tsconfig.json',
    },
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          'no-console': 'off',
          'import/prefer-default-export': 'off',
        },
      },
    ],
  }),
];

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};

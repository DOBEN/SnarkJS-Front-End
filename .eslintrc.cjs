module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    // TODO: set up eslint rules.
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
};

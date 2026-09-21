const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '**/*.cjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
    rules: { '@typescript-eslint/no-explicit-any': 'warn' },
  },
  prettier,
);

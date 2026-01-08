/* eslint-disable no-undef */
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: path.dirname(__filename),
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('expo'),
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'build/', 'eslint.config.js'],
  },
  {
    rules: {
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
    },
  },
];

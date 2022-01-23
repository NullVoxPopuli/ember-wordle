'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ['./public/words.js'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
  ],
};

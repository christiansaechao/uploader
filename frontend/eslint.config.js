import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'quotes': ['error', 'single'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
    },
  },
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      // Disable React in JSX scope rule for modern React (17+)
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      // Disable prop-types validation (you can enable if you use PropTypes)
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

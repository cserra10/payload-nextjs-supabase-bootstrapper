import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';

/**
 * Shared ESLint configuration for the monorepo
 *
 * Standards:
 * - Single quotes for strings
 * - Consistent import/export formatting
 * - TypeScript best practices
 * - Unused import detection
 */

const baseRules = {
  // General code quality
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-unused-vars': 'off', // Handled by TypeScript
  'prefer-const': 'error',
  'no-var': 'error',

  // Style consistency
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'comma-dangle': ['error', 'always-multiline'],
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],

  // Import/export rules (temporarily disabled while configuring)
  // 'import/order': [
  //   'error',
  //   {
  //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  //     'newlines-between': 'always',
  //     alphabetize: { order: 'asc', caseInsensitive: true },
  //   },
  // ],
  // 'import/newline-after-import': 'error',
};

const reactRules = {
  // JSX formatting - max 2 props per line
  'react/jsx-max-props-per-line': ['error', { maximum: 2, when: 'multiline' }],
  'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-wrap-multilines': [
    'error',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    },
  ],
};

const typescriptRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-import-type-side-effects': 'error',
};

export default [
  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Base configurations
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,

  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/pnpm-lock.yaml',
    ],
  },

  // Apply rules to all files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...baseRules,
      ...typescriptRules,
    },
  },

  // Apply React rules to JSX/TSX files
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      ...reactRules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },

  // Specific config for config files
  {
    files: ['**/*.config.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
];

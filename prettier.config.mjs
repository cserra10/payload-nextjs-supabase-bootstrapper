/**
 * @type {import("prettier").Config}
 * Shared Prettier configuration for the entire monorepo
 *
 * Standards:
 * - Single quotes for strings
 * - 2 spaces for indentation
 * - Spaces around braces in object literals
 * - Semicolons for consistency
 * - Line width 100 for readability
 * - Max 2 props per line for JSX
 */
const config = {
  // Core formatting
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: 'lf',

  // Trailing commas for cleaner diffs
  trailingComma: 'es5',

  // Bracket spacing for object literals
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow function parentheses
  arrowParens: 'avoid',

  // Prose wrapping
  proseWrap: 'preserve',

  // Quote props only when necessary
  quoteProps: 'as-needed',

  // JSX formatting
  jsxSingleQuote: true,
};

export default config;

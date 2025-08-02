/**
 * @type {import("prettier").Config}
 * Shared prettier configuration
 */
const config = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: 'lf',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
};

export default config;

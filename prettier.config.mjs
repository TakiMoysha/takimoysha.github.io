const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  vueIndentScriptAndStyle: true,
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  alignAttributeValues: 'packed',
  wrapAttributes: 'auto',
  plugins: [
    '@prettier/plugin-vue',
    '@prettier/plugin-html',
    '@prettier/plugin-json',
    '@prettier/plugin-typescript',
    '@prettier/plugin-babel',
  ],
};

export default config;

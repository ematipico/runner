module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",

  extends: [
    "plugin:@typescript-eslint/recommended",
		"plugin:node/recommended",
		"prettier",
    "prettier/@typescript-eslint"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  plugins: ["@typescript-eslint", "prettier"],

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
  	"node/no-unsupported-features/es-syntax": "off",
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};

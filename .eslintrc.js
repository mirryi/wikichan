module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    node: false,
  },
  globals: {
    process: "readonly",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:no-unsanitized/DOM",
  ],
  rules: {
    "prettier/prettier": 0,
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/triple-slash-reference": "off",
  },
};

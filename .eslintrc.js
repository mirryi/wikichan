module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier/@typescript-eslint",
        "plugin:no-unsanitized/DOM",
    ],
    rules: {
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false, classes: false, variables: true },
        ],
        "@typescript-eslint/explicit-function-return-type": ["error"],
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
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
};

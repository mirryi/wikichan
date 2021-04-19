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
    extends: ["plugin:react/recommended", "plugin:no-unsanitized/DOM"],
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
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            extends: ["plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint"],
            rules: {
                "no-use-before-define": "off",
                "@typescript-eslint/consistent-type-assertions": [
                    "error",
                    { assertionStyle: "never" },
                ],
                "@typescript-eslint/explicit-function-return-type": [
                    "error",
                    { allowExpressions: true },
                ],
                "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
                "@typescript-eslint/no-use-before-define": [
                    "error",
                    { functions: false, classes: false, variables: true },
                ],
            },
        },
    ],
};

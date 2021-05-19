module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: ["plugin:react/recommended", "plugin:no-unsanitized/DOM"],
    plugins: ["react-hooks", "simple-import-sort"],
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
            extends: [
                "plugin:@typescript-eslint/recommended",
                "plugin:@typescript-eslint/recommended-requiring-type-checking",
                "prettier/@typescript-eslint",
            ],
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
                "@typescript-eslint/no-inferrable-types": ["off"],
                "@typescript-eslint/no-namespace": ["off"],
                "@typescript-eslint/no-unused-vars": [
                    "warn",
                    { argsIgnorePattern: "^_", ignoreRestSiblings: true },
                ],
                "@typescript-eslint/no-use-before-define": [
                    "error",
                    { functions: false, classes: false, variables: true },
                ],
                "@typescript-eslint/require-await": ["off"],
            },
        },
    ],
    reportUnusedDisableDirectives: true,
};

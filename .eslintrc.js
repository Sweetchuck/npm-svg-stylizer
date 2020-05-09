module.exports = {
    root:     true,
    env: {
        node: true
    },
    settings: {},
    parser:   '@typescript-eslint/parser',
    plugins:  [
        '@typescript-eslint'
    ],
    extends:  [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {}
};

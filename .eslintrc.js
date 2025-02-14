module.exports = {
    extends: 'expensify',
    parser: '@babel/eslint-parser',
    rules: {
        'react/jsx-filename-extension': [1, {extensions: ['.js']}],
        'comma-dangle': ['error', 'always-multiline'],
        'rulesdir/no-api-in-views': 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                ],
            },
        },
    },
};

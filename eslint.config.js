const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintRecommended = require('@eslint/js').configs.recommended;

module.exports = [
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: './tsconfig.json',
            },
            globals: {
                process: 'readonly', // Declaramos 'process' como una variable global readonly
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            prettier: prettierRecommended.plugins.prettier,
        },
        rules: {
            ...eslintRecommended.rules,
            ...typescriptEslintPlugin.configs.recommended.rules,
            ...prettierRecommended.rules,
            '@typescript-eslint/no-unused-vars': 'error',
            'prettier/prettier': 'error',
            'no-console': 'warn',
        },
    },
    {
        files: ['**/*.spec.ts'],
        languageOptions: {
            globals: {
                describe: true,
                it: true,
                expect: true,
                beforeEach: true,
            },
        },
    },
    {
        ignores: ['dist/', 'node_modules/', 'coverage/'],
    },
];

// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import nodePlugin from 'eslint-plugin-n';
import sonarjs from 'eslint-plugin-sonarjs';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed';
import pluginSecurity from 'eslint-plugin-security';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      '**/*.mjs',
      'eslint.config.mjs',
      '**/*.js',
    ],
  },
  {
    settings: {
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  eslintPluginUnicorn.configs.recommended,
  sonarjs.configs.recommended,
  nodePlugin.configs['flat/recommended-module'],
  pluginPromise.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  eslintNestJs.configs.flatRecommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'n/no-missing-import': 'off',
      'n/no-unpublished-import': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
);

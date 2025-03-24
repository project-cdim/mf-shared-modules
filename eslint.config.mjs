/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginImport from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJest from 'eslint-plugin-jest';
import pluginTestingLibrary from 'eslint-plugin-testing-library';
import pluginNext from '@next/eslint-plugin-next';
import pluginStorybook from 'eslint-plugin-storybook';

export default [
  {
    ignores: [
      '**/jest.config.js',
      '**/jest.setup.js',
      '**/i18n.ts',
      '**/next.config.js',
      '**/dummy-data/**/*',
      '**/**.d.ts',
      '**/postcss.config.js',
      '**/eslint.config.mjs',
    ],
  },
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  // eslint
  {
    rules: {
      ...js.configs.recommended.rules,
      'max-depth': ['error', 4],
      'no-implicit-coercion': 'error',
      'no-unused-vars': 'off',
      complexity: ['warn', 10],
    },
  },
  // typescript-eslint
  {
    name: tseslint.configs.base.name,
    plugins: {
      ...tseslint.configs.base.plugins,
    },
    rules: {
      ...tseslint.configs.eslintRecommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': false,
        },
      ],
      complexity: ['warn', 10],
      '@typescript-eslint/strict-boolean-expressions': [
        'warn',
        {
          allowAny: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableEnum: false,
          allowNullableNumber: false,
        },
      ],
    },
  },
  // eslint-plugin-react
  {
    files: ['**/*.tsx'],
    plugins: {
      ...pluginReact.configs.flat.recommended.plugins,
      // ...pluginReactHooks.configs.recommended.plugins,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
        },
      ],
      'react/jsx-users-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // eslint-plugin-next
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  // eslint-plugin-import
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginImport.flatConfigs.recommended,
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  // jest
  {
    files: ['**/__test__/**/*.ts(x)'],
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      ...pluginJest.configs['flat/style'].rules,
      ...pluginTestingLibrary.configs['flat/react'].rules,
      'jest/prefer/expect-assertions': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': false,
          'ts-ignore': false,
        },
      ],
      'jest/consistent-test-it': [
        'error',
        {
          fn: 'test',
        },
      ],
      'testing-library/no-node-access': 'off',
      'no-implicit-coercion': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
    },
  },
  // story-book
  {
    files: ['**/stories/*.[t]s?(x)'],
    rules: {
      ...pluginStorybook.configs['flat/recommended'].rules,
    },
  },
  // prettier
  eslintConfigPrettier,
];

import eslint from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  prettier, // Use directly, not with spread operator
  ...vuePlugin.configs['flat/recommended'],

  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
      vue: vuePlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleAttributePerLine: true,
          bracketSameLine: false,
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always', // Always use self-closing for void elements
            normal: 'never', // Never self-close normal elements
            component: 'always', // Always self-close Vue components
          },
        },
      ],
      'vue/multiline-html-element-content-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off', // Add this line
      'vue/html-closing-bracket-newline': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
];

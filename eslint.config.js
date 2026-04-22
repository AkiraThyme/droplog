import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];

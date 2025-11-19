import config from '@repo/eslint-config';

export default [
  ...config,
  {
    ignores: ['dist/**', 'build/**', 'comparison-results/**', '.next/**'],
  },
];

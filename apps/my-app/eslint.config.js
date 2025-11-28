import { reactConfig } from '@repo/eslint-config/react';

export default [
  ...reactConfig,
  {
    ignores: ['dist/**', 'build/**', 'comparison-results/**', '.next/**'],
  },
];

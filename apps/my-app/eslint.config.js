import { reactConfig } from '@repo/eslint-config/react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'comparison-results/**',
      '**/*.config.js',
      '**/vite.config.*',
      '**/tsconfig.tsbuildinfo',
      '**/*.gen.ts',
      '**/*.gen.js',
      'node_modules/**',
    ],
  },
  ...reactConfig
);

import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from './base.js';

/**
 * Configuration for React projects
 * Includes:
 * - Base Config (TS/JS + Prettier)
 * - React Hooks
 * - React Refresh
 */
export const reactConfig = tseslint.config(...baseConfig, {
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
});

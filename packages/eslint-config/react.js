import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from './base.js';

/**
 * React 프로젝트 ESLint 설정
 * - Base Config (TS/JS + Prettier)
 * - React Hooks 규칙
 * - React Refresh 최적화
 */
export const reactConfig = tseslint.config(...baseConfig, {
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': 'off',
  },
});

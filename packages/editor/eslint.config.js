import baseConfig from '@repo/eslint-config';

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // CKEditor uses any types
    },
  },
];

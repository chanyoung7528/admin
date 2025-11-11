import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname, resolve } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  viteFinal: async config => {
    // Tailwind CSS 지원
    const { default: tailwindcss } = await import('@tailwindcss/vite');

    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // shared 패키지의 alias 추가
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hooks': resolve(__dirname, '../../../packages/shared/src/hooks'),
      '@lib': resolve(__dirname, '../../../packages/shared/src/lib'),
      '@ui': resolve(__dirname, '../../../packages/shared/src/components/ui'),
      '@components': resolve(__dirname, '../../../packages/shared/src/components'),
      '@stores': resolve(__dirname, '../../../packages/shared/src/stores'),
    };

    // 파일 확장자 해결 설정
    config.resolve.extensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'];

    return config;
  },
};

export default config;

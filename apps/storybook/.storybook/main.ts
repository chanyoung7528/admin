import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join, resolve } from 'path';

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

      // date-picker 패키지
      '@repo/date-picker': resolve(__dirname, '../../../packages/date-picker/src'),
      '@repo/date-picker/styles.css': resolve(__dirname, '../../../packages/date-picker/src/styles.css'),

      // shared 패키지 가져오기 (구체적인 것부터 먼저)
      '@repo/shared/globals.css': resolve(__dirname, '../../../packages/shared/src/styles/globals.css'),
      '@repo/shared/components/ui': resolve(__dirname, '../../../packages/shared/src/components/ui'),
      '@repo/shared/components/context': resolve(__dirname, '../../../packages/shared/src/components/context'),
      '@repo/shared/components/layouts': resolve(__dirname, '../../../packages/shared/src/components/layouts'),
      '@repo/shared/components': resolve(__dirname, '../../../packages/shared/src/components'),
      '@repo/shared/lib': resolve(__dirname, '../../../packages/shared/src/lib'),
      '@repo/shared/hooks': resolve(__dirname, '../../../packages/shared/src/hooks'),
      '@repo/shared/stores': resolve(__dirname, '../../../packages/shared/src/stores'),
      '@repo/shared/assets': resolve(__dirname, '../../../packages/shared/src/assets'),
      '@repo/shared': resolve(__dirname, '../../../packages/shared/src'),

      // shared 패키지 내부에서 사용하는 alias (빌드시 resolve용)
      '@shared/ui': resolve(__dirname, '../../../packages/shared/src/components/ui'),
      '@shared/components': resolve(__dirname, '../../../packages/shared/src/components'),
      '@shared/lib': resolve(__dirname, '../../../packages/shared/src/lib'),
      '@shared/hooks': resolve(__dirname, '../../../packages/shared/src/hooks'),
      '@shared/stores': resolve(__dirname, '../../../packages/shared/src/stores'),
      '@shared/assets': resolve(__dirname, '../../../packages/shared/src/assets'),
      '@shared': resolve(__dirname, '../../../packages/shared/src'),
    };

    // 파일 확장자 해결 설정
    config.resolve.extensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'];

    // React 중복 방지 (중요!)
    config.resolve.dedupe = ['react', 'react-dom'];

    // 빌드 최적화 설정
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.output = {
      ...config.build.rollupOptions.output,
      manualChunks: id => {
        // React 및 React DOM을 별도 청크로 분리
        if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
          return 'react-vendor';
        }

        // Radix UI 컴포넌트를 별도 청크로 분리
        if (id.includes('node_modules/@radix-ui/')) {
          return 'radix-vendor';
        }

        // Lucide 아이콘을 별도 청크로 분리
        if (id.includes('node_modules/lucide-react/')) {
          return 'lucide-vendor';
        }

        // Storybook 관련 패키지
        if (id.includes('node_modules/@storybook/')) {
          return 'storybook-vendor';
        }

        // 기타 큰 node_modules 패키지
        if (id.includes('node_modules/')) {
          return 'vendor';
        }
      },
    };

    // 청크 크기 경고 임계값 증가 (Storybook은 일반적으로 크므로)
    // Storybook 런타임이 크기 때문에 임계값을 높게 설정
    config.build.chunkSizeWarningLimit = 3000;

    return config;
  },
};

export default config;

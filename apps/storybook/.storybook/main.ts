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

    // CKEditor 빌드 경고 무시
    config.build = config.build || {};
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.onwarn = (warning, warn) => {
      // CKEditor 관련 경고 무시
      if (warning.message.includes('ckeditor5-custom-build')) {
        return;
      }
      warn(warning);
    };

    // shared 패키지의 alias 추가
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,

      // React 중복 방지를 위한 명시적 alias (최우선)
      react: resolve(__dirname, '../../../node_modules/react'),
      'react-dom': resolve(__dirname, '../../../node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, '../../../node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': resolve(__dirname, '../../../node_modules/react/jsx-dev-runtime'),

      // date-picker 패키지
      '@repo/date-picker': resolve(__dirname, '../../../packages/date-picker/src'),
      '@repo/date-picker/styles.css': resolve(__dirname, '../../../packages/date-picker/src/styles.css'),

      // editor 패키지
      '@repo/editor': resolve(__dirname, '../../../packages/editor/src'),

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
    config.resolve.dedupe = ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'];

    // 의존성 최적화 설정 (개발 모드)
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'dayjs',
      'react-datepicker',
    ];
    config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude || []), 'ckeditor5-custom-build', '@ckeditor/ckeditor5-react'];

    // ESBuild 옵션으로 React alias 보장
    config.optimizeDeps.esbuildOptions = {
      ...(config.optimizeDeps.esbuildOptions || {}),
      alias: {
        react: resolve(__dirname, '../../../node_modules/react'),
        'react-dom': resolve(__dirname, '../../../node_modules/react-dom'),
      },
    };

    // React를 외부 모듈로 표시하지 않도록 설정
    config.build.rollupOptions.external = [];

    config.build.rollupOptions.output = {
      ...config.build.rollupOptions.output,
      manualChunks: id => {
        // React 및 React DOM을 별도 청크로 분리 (최우선 - 단일 인스턴스 보장)
        // 더 엄격한 조건으로 React만 정확하게 매칭
        const normalizedId = id.replace(/\\/g, '/');

        // React 코어 (node_modules/react/index.js 등)
        if (
          normalizedId.includes('/node_modules/react/') &&
          !normalizedId.includes('/node_modules/react-dom/') &&
          !normalizedId.includes('/node_modules/react-')
        ) {
          return 'react-vendor';
        }

        // React-DOM
        if (normalizedId.includes('/node_modules/react-dom/')) {
          return 'react-vendor';
        }

        // Scheduler (React에서 사용)
        if (normalizedId.includes('/node_modules/scheduler/')) {
          return 'react-vendor';
        }

        // Radix UI 컴포넌트를 별도 청크로 분리
        if (normalizedId.includes('/node_modules/@radix-ui/')) {
          return 'radix-vendor';
        }

        // Lucide 아이콘을 별도 청크로 분리
        if (normalizedId.includes('/node_modules/lucide-react/')) {
          return 'lucide-vendor';
        }

        // Storybook 관련 패키지
        if (normalizedId.includes('/node_modules/@storybook/')) {
          return 'storybook-vendor';
        }

        // 기타 큰 node_modules 패키지
        if (normalizedId.includes('/node_modules/')) {
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

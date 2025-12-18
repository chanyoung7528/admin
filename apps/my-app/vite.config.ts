import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';

function createProxyConfig(target: string, prefix: string): Record<string, ProxyOptions> {
  const prefixPattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

  return {
    [prefix]: {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(prefixPattern, ''),
      secure: false,
      configure: proxy => {
        proxy.on('error', (err, req) => {
          console.error('[Proxy Error]', err instanceof Error ? err.message : String(err), req.url);
        });
        proxy.on('proxyReq', proxyReq => {
          proxyReq.setHeader('Origin', target);
          proxyReq.setHeader('Referer', target);
        });
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDebug = env.VITE_FEATURE_DEBUG === 'true';
  const apiBaseUrl = env.VITE_API_BASE_URL || '';
  const proxyPrefix = env.VITE_API_PROXY_PREFIX || '/api';
  const useProxy = mode === 'development' && apiBaseUrl.startsWith('http');

  return {
    server: {
      proxy: useProxy ? createProxyConfig(apiBaseUrl, proxyPrefix) : undefined,
    },
    plugins: [
      TanStackRouterVite({
        routesDirectory: './src/pages',
        generatedRouteTree: './src/routeTree.gen.ts',
      }),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
      visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    define: {
      __VITE_FEATURE_DEBUG__: JSON.stringify(isDebug),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        // @repo/shared 패키지 경로 해석 (구체적인 경로부터 정의)
        '@repo/shared/globals.css': path.resolve(__dirname, '../../packages/shared/src/styles/globals.css'),
        '@repo/shared/components/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
        '@repo/shared/components/context': path.resolve(__dirname, '../../packages/shared/src/components/context'),
        '@repo/shared/components/layouts': path.resolve(__dirname, '../../packages/shared/src/components/layouts'),
        '@repo/shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
        '@repo/shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
        '@repo/shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
        '@repo/shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
        '@repo/shared': path.resolve(__dirname, '../../packages/shared/src'),

        // @shared 내부 alias (shared 패키지 소스 내에서 사용하는 alias resolve용)
        '@shared/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
        '@shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
        '@shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
        '@shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
        '@shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
        '@shared': path.resolve(__dirname, '../../packages/shared/src'),

        // my-app 앱 내부 경로
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      pure: isDebug ? [] : ['console.log', 'console.debug', 'console.trace'],
      drop: isDebug ? [] : ['debugger'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes('node_modules')) {
              // React 코어
              if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
                return 'react-vendor';
              }

              // UI 라이브러리 (Radix UI + Icons)
              if (id.includes('@radix-ui') || id.includes('lucide-react')) {
                return 'ui-vendor';
              }

              // 차트 라이브러리
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'chart-vendor';
              }

              // 앱 코어: 상태/데이터 관리 계층
              if (
                id.includes('@tanstack/react-router') ||
                id.includes('@tanstack/react-query') ||
                id.includes('@tanstack/react-table') ||
                id.includes('axios') ||
                id.includes('zustand')
              ) {
                return 'app-vendor';
              }

              // UI 유틸리티
              if (
                id.includes('react-hook-form') ||
                id.includes('@hookform') ||
                id.includes('zod') ||
                id.includes('date-fns') ||
                id.includes('lodash-es') ||
                id.includes('clsx') ||
                id.includes('class-variance-authority') ||
                id.includes('tailwind-merge')
              ) {
                return 'ui-utils-vendor';
              }

              // 기타 vendor
              return 'vendor';
            }

            // 도메인별 코드 분할 (실제 존재하는 도메인만)
            if (id.includes('src/domains/')) {
              if (id.includes('domains/auth')) return 'domain-auth';
              if (id.includes('domains/dashboard')) return 'domain-dashboard';
              if (id.includes('domains/settlement')) return 'domain-settlement';
              if (id.includes('domains/template/my-food')) return 'domain-my-food';
            }

            // shared 패키지 분리
            if (id.includes('packages/shared/src/components/ui')) {
              return 'shared-ui';
            }
            if (id.includes('packages/shared')) {
              return 'shared';
            }

            return undefined;
          },
        },
      },
      sourcemap: isDebug,
      minify: !isDebug ? 'esbuild' : false,
      target: 'ES2022',
      cssCodeSplit: true,
    },
  };
});

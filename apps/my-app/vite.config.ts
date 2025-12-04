import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

// 개발 환경 API 프록시 설정
function createProxyConfig(target: string, prefix: string) {
  const prefixPattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);

  return {
    [prefix]: {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(prefixPattern, ''),
      secure: false,
      configure: (proxy: any) => {
        proxy.on('error', (err: Error, req: any) => {
          console.error('[Proxy Error]', err.message, req.url);
        });
        proxy.on('proxyReq', (proxyReq: any) => {
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
      // 번들 분석 도구 (빌드 시 stats.html 생성)
      visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        // shared 패키지 가져오기 (구체적인 것부터 먼저)
        '@repo/shared/globals.css': path.resolve(__dirname, '../../packages/shared/src/styles/globals.css'),
        '@repo/shared/components/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
        '@repo/shared/components/context': path.resolve(__dirname, '../../packages/shared/src/components/context'),
        '@repo/shared/components/layouts': path.resolve(__dirname, '../../packages/shared/src/components/layouts'),
        '@repo/shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
        '@repo/shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
        '@repo/shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
        '@repo/shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
        '@repo/shared': path.resolve(__dirname, '../../packages/shared/src'),

        // shared 패키지 내부에서 사용하는 alias (빌드시 resolve용)
        '@shared/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
        '@shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
        '@shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
        '@shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
        '@shared/assets': path.resolve(__dirname, '../../packages/shared/src/assets'),
        '@shared': path.resolve(__dirname, '../../packages/shared/src'),

        // my-app 자체의 alias (마지막에)
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      pure: isDebug ? [] : ['console.log', 'console.info', 'console.debug', 'console.trace', 'console.group', 'console.groupEnd'],
      drop: isDebug ? [] : ['debugger'],
    },
    build: {
      // 번들 크기 최적화
      rollupOptions: {
        output: {
          manualChunks: id => {
            // node_modules 처리
            if (id.includes('node_modules')) {
              // React 코어 + scheduler (정확한 패키지만 매칭)
              if (
                id.includes('/react/') ||
                id.includes('/react-dom/') ||
                id.includes('/scheduler/') ||
                id.match(/node_modules\/react$/) ||
                id.match(/node_modules\/react-dom$/) ||
                id.match(/node_modules\/scheduler$/)
              ) {
                return 'react-vendor';
              }
              // TanStack Router & Query
              if (id.includes('@tanstack/react-router')) {
                return 'router-vendor';
              }
              if (id.includes('@tanstack/react-query')) {
                return 'query-vendor';
              }
              // TanStack Table
              if (id.includes('@tanstack/react-table') || id.includes('@tanstack/table-core')) {
                return 'table-vendor';
              }
              // Radix UI - 모두 하나의 청크로 (순환 참조 방지)
              if (id.includes('@radix-ui')) {
                return 'radix-vendor';
              }
              // 아이콘 라이브러리
              if (id.includes('lucide-react')) {
                return 'icon-vendor';
              }
              // Command palette
              if (id.includes('cmdk')) {
                return 'cmdk-vendor';
              }
              // Form 관련 라이브러리
              if (id.includes('react-hook-form') || id.includes('@hookform')) {
                return 'form-vendor';
              }
              // Zod validation
              if (id.includes('zod')) {
                return 'zod-vendor';
              }
              // 상태 관리
              if (id.includes('zustand')) {
                return 'state-vendor';
              }
              // HTTP 클라이언트
              if (id.includes('axios')) {
                return 'http-vendor';
              }
              // 나머지 vendor
              return 'vendor';
            }

            // 도메인별 코드 분할
            if (id.includes('src/domains/')) {
              if (id.includes('domains/my-food')) return 'domain-my-food';
              if (id.includes('domains/user')) return 'domain-user';
              if (id.includes('domains/order')) return 'domain-order';
              if (id.includes('domains/settlement')) return 'domain-settlement';
              if (id.includes('domains/inquiry')) return 'domain-inquiry';
              if (id.includes('domains/monitoring')) return 'domain-monitoring';
              if (id.includes('domains/report')) return 'domain-report';
              if (id.includes('domains/billing')) return 'domain-billing';
              if (id.includes('domains/content')) return 'domain-content';
              if (id.includes('domains/dashboard')) return 'domain-dashboard';
              if (id.includes('domains/insight')) return 'domain-insight';
              if (id.includes('domains/site')) return 'domain-site';
              if (id.includes('domains/auth')) return 'domain-auth';
            }

            // shared 패키지 UI 컴포넌트 분리
            if (id.includes('packages/shared/src/components/ui')) {
              return 'shared-ui';
            }

            // shared 패키지의 나머지
            if (id.includes('packages/shared')) {
              return 'shared';
            }

            // 기본값 반환하지 않으면 Vite가 자동으로 처리
            return undefined;
          },
        },
      },
      // 청크 크기 경고 임계값 (기본 500kb)
      chunkSizeWarningLimit: 600,
      // 소스맵 제거 (프로덕션)
      sourcemap: isDebug,
      // 최소화 옵션
      minify: 'esbuild',
      target: 'esnext',
      // CSS 코드 분할
      cssCodeSplit: true,
    },
    // 최적화 설정
    optimizeDeps: {
      include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
    },
  };
});

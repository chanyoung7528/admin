import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
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
    alias: {
      // shared 패키지의 alias (구체적인 것부터 먼저)
      '@repo/shared/components/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
      '@repo/shared/components': path.resolve(__dirname, '../../packages/shared/src/components'),
      '@repo/shared/ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
      '@repo/shared/lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
      '@repo/shared/hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
      '@repo/shared/stores': path.resolve(__dirname, '../../packages/shared/src/stores'),
      '@repo/shared': path.resolve(__dirname, '../../packages/shared/src'),

      // shared 패키지 내부에서 사용하는 alias들 (shared vite.config.ts와 동일)
      '@ui': path.resolve(__dirname, '../../packages/shared/src/components/ui'),
      '@lib': path.resolve(__dirname, '../../packages/shared/src/lib'),
      '@hooks': path.resolve(__dirname, '../../packages/shared/src/hooks'),
      '@components': path.resolve(__dirname, '../../packages/shared/src/components'),
      '@stores': path.resolve(__dirname, '../../packages/shared/src/stores'),

      // my-app 자체의 alias (마지막에)
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 번들 크기 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리 분리
          'react-vendor': ['react', 'react-dom'],
          // TanStack 라이브러리 분리
          'tanstack-vendor': ['@tanstack/react-router', '@tanstack/react-query'],
          // 기타 vendor 라이브러리
          vendor: ['axios', 'zustand'],
        },
      },
    },
    // 청크 크기 경고 임계값 (기본 500kb)
    chunkSizeWarningLimit: 1000,
    // 소스맵 제거 (프로덕션)
    sourcemap: false,
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
});

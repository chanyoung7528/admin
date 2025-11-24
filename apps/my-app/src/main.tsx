import { ensureAuthClient } from '@/domains/auth/lib/apiClient';
import { initializeAuthSession } from '@/domains/auth/lib/tokenManager';
import { env } from '@repo/core/config';
import { ThemeProvider } from '@repo/shared/components/context';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import 'cookie-store';
import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { queryClient, router } from './router';

// 개발 모드에서만 DevTools를 동적으로 로드
const ReactQueryDevtools = env.isDebug
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then(res => ({
        default: res.ReactQueryDevtools,
      }))
    )
  : () => null;

async function bootstrap() {
  ensureAuthClient();
  await initializeAuthSession();

  const rootElement = document.getElementById('root')!;

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Suspense fallback={null}>
            <ReactQueryDevtools />
          </Suspense>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
}

void bootstrap();

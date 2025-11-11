import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';

// Set up QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// 개발 도구는 동적 import로 로드 (프로덕션 빌드에서 제외됨)
if (import.meta.env.MODE === 'development') {
  import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools }) => {
    const devToolRoot = document.createElement('div');
    document.body.appendChild(devToolRoot);
    ReactDOM.createRoot(devToolRoot).render(<ReactQueryDevtools />);
  });
}

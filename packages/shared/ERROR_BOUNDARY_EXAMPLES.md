# ErrorBoundary 사용 예제

`@repo/shared`에서 선언형 ErrorBoundary 컴포넌트를 사용할 수 있습니다.

## 빠른 시작

### 1. Import

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
```

### 2. 기본 사용

```tsx
function App() {
  return (
    <ErrorBoundary fallback="default">
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## 실제 프로젝트 예제

### 라우트 레벨 에러 바운더리

```tsx
// apps/my-app/src/pages/__root.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
import { Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary
      fallback="default"
      showHomeButton={true}
      onError={(error, info) => {
        // Sentry나 다른 모니터링 서비스로 전송
        console.error('라우트 에러:', error, info);
      }}
    >
      <Outlet />
    </ErrorBoundary>
  ),
});
```

### 페이지 레벨 에러 바운더리

```tsx
// apps/my-app/src/pages/_authenticated/dashboard.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
import { DashboardContent } from '@/domains/dashboard';

export default function DashboardPage() {
  return (
    <ErrorBoundary fallback="default" title="대시보드 로딩 실패" description="대시보드 데이터를 불러오는 중 문제가 발생했습니다.">
      <DashboardContent />
    </ErrorBoundary>
  );
}
```

### 컴포넌트 레벨 에러 바운더리

```tsx
// apps/my-app/src/domains/dashboard/components/Chart.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

export function DashboardChart() {
  return (
    <ErrorBoundary fallback="simple">
      <ComplexChart data={chartData} />
    </ErrorBoundary>
  );
}
```

### 비동기 API 호출 에러 처리

```tsx
import { ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';

function UserProfile() {
  const handleError = useErrorHandler();

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('사용자 정보 조회 실패');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <button onClick={fetchUser}>사용자 정보 불러오기</button>
    </div>
  );
}

function UserPage() {
  return (
    <ErrorBoundary fallback="default" title="사용자 정보 오류">
      <UserProfile />
    </ErrorBoundary>
  );
}
```

### 폼 제출 에러 처리

```tsx
import { ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';

function UserForm() {
  const handleError = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', { method: 'POST' });
      if (!response.ok) throw new Error('폼 제출 실패');
    } catch (error) {
      handleError(error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

export default function FormPage() {
  return (
    <ErrorBoundary fallback="simple">
      <UserForm />
    </ErrorBoundary>
  );
}
```

### 중첩된 에러 바운더리로 세밀한 제어

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

export default function ComplexPage() {
  return (
    <ErrorBoundary fallback="default" showHomeButton={true}>
      <Header />

      <div className="grid grid-cols-3 gap-4">
        <aside>
          <ErrorBoundary fallback="simple">
            <Sidebar />
          </ErrorBoundary>
        </aside>

        <main className="col-span-2">
          <ErrorBoundary fallback="simple">
            <MainContent />
          </ErrorBoundary>
        </main>
      </div>

      <footer>
        <ErrorBoundary fallback="minimal">
          <Footer />
        </ErrorBoundary>
      </footer>
    </ErrorBoundary>
  );
}
```

## 폴백 스타일 가이드

- **`fallback="default"`**: 페이지 레벨 에러 (전체 화면)
- **`fallback="simple"`**: 섹션/컴포넌트 레벨 에러 (인라인 박스)
- **`fallback="minimal"`**: 작은 UI 요소 에러 (한 줄)
- **커스텀 컴포넌트**: 특별한 UI가 필요한 경우

## 더 많은 예제

스토리북에서 다양한 예제를 확인하세요:

```bash
cd apps/storybook
pnpm dev
```

브라우저에서 http://localhost:6006 접속 후 "Components/ErrorBoundary" 섹션 확인

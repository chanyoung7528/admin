# ErrorBoundary 사용 가이드

`react-error-boundary`를 기반으로 한 선언형 에러 처리 컴포넌트입니다.

## 설치

이미 `@repo/shared` 패키지에 포함되어 있습니다:

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
```

## 기본 사용법

### 1. 기본 에러 바운더리

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function App() {
  return (
    <ErrorBoundary fallback="default">
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### 2. 심플한 스타일

인라인 표시에 적합한 중간 크기의 에러 UI:

```tsx
<ErrorBoundary fallback="simple">
  <YourComponent />
</ErrorBoundary>
```

### 3. 최소한의 스타일

작은 공간에 적합한 미니멀한 에러 UI:

```tsx
<ErrorBoundary fallback="minimal">
  <YourComponent />
</ErrorBoundary>
```

## 고급 사용법

### 커스텀 메시지

```tsx
<ErrorBoundary fallback="default" title="서버 연결 실패" description="서버와의 연결이 끊어졌습니다. 네트워크를 확인해 주세요." showHomeButton={true}>
  <YourComponent />
</ErrorBoundary>
```

### 에러 로깅

```tsx
<ErrorBoundary
  fallback="default"
  onError={(error, info) => {
    // Sentry, LogRocket 등으로 전송
    console.error('에러 발생:', error);
    console.error('컴포넌트 스택:', info.componentStack);
  }}
  onReset={() => {
    console.log('에러 바운더리 리셋됨');
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 커스텀 폴백 컴포넌트

```tsx
import type { FallbackProps } from '@repo/shared/components/ui';

function CustomFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="custom-error-container">
      <h1>문제가 발생했습니다</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>다시 시도</button>
    </div>
  );
}

<ErrorBoundary fallback={CustomFallback}>
  <YourComponent />
</ErrorBoundary>;
```

## 비동기 에러 처리

`useErrorHandler` 훅을 사용하여 비동기 작업의 에러를 처리할 수 있습니다:

```tsx
import { ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';

function AsyncComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('API 요청 실패');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error); // 에러를 ErrorBoundary로 전달
    }
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
}

function App() {
  return (
    <ErrorBoundary fallback="default">
      <AsyncComponent />
    </ErrorBoundary>
  );
}
```

## 중첩된 에러 바운더리

여러 레벨의 에러 바운더리를 중첩하여 세밀한 에러 처리가 가능합니다:

```tsx
function App() {
  return (
    <ErrorBoundary fallback="default" title="전체 앱 에러">
      <Layout>
        <ErrorBoundary fallback="simple">
          <Sidebar />
        </ErrorBoundary>

        <main>
          <ErrorBoundary fallback="simple">
            <Content />
          </ErrorBoundary>
        </main>
      </Layout>
    </ErrorBoundary>
  );
}
```

## 라우팅과 함께 사용

TanStack Router와 함께 사용:

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary fallback="default" showHomeButton={true}>
      <Outlet />
    </ErrorBoundary>
  ),
});
```

## API Reference

### ErrorBoundary Props

| Prop             | Type                                              | Default                              | Description                               |
| ---------------- | ------------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| `fallback`       | `'default' \| 'simple' \| 'minimal' \| Component` | `'default'`                          | 폴백 UI 스타일 또는 커스텀 컴포넌트       |
| `title`          | `string`                                          | `'문제가 발생했습니다'`              | 에러 제목 (default 폴백에만 적용)         |
| `description`    | `string`                                          | `'예상치 못한 오류가 발생했습니다.'` | 에러 설명 (default 폴백에만 적용)         |
| `showHomeButton` | `boolean`                                         | `false`                              | 홈 버튼 표시 여부 (default 폴백에만 적용) |
| `onError`        | `(error, info) => void`                           | -                                    | 에러 발생 시 콜백                         |
| `onReset`        | `() => void`                                      | -                                    | 리셋 시 콜백                              |
| `resetKeys`      | `Array<any>`                                      | -                                    | 이 값이 변경되면 자동으로 리셋            |

### FallbackProps

커스텀 폴백 컴포넌트가 받는 props:

```tsx
interface FallbackProps {
  error: Error; // 발생한 에러 객체
  resetErrorBoundary: () => void; // 에러 바운더리를 리셋하는 함수
}
```

## 모범 사례

### 1. 적절한 수준에서 사용하기

```tsx
// ✅ 좋은 예: 각 주요 섹션마다 에러 바운더리
<ErrorBoundary fallback="default">
  <Header />
</ErrorBoundary>

<ErrorBoundary fallback="simple">
  <MainContent />
</ErrorBoundary>

<ErrorBoundary fallback="minimal">
  <Footer />
</ErrorBoundary>

// ❌ 나쁜 예: 너무 세밀하게 사용
<ErrorBoundary>
  <Button />
</ErrorBoundary>
```

### 2. 에러 로깅 설정

```tsx
// 모든 에러를 모니터링 서비스로 전송
<ErrorBoundary
  fallback="default"
  onError={(error, info) => {
    // Sentry 예시
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: info.componentStack,
        },
      },
    });
  }}
>
  <App />
</ErrorBoundary>
```

### 3. 상황에 맞는 폴백 UI 선택

- **페이지 레벨**: `fallback="default"` + `showHomeButton={true}`
- **섹션/컴포넌트 레벨**: `fallback="simple"`
- **작은 UI 요소**: `fallback="minimal"`
- **특별한 케이스**: 커스텀 폴백 컴포넌트

## 주의사항

1. **이벤트 핸들러의 에러는 자동으로 캐치되지 않습니다**
   - 이벤트 핸들러에서는 `useErrorHandler` 훅을 사용하세요

2. **비동기 코드의 에러는 명시적으로 처리해야 합니다**
   - try-catch와 `useErrorHandler`를 함께 사용하세요

3. **서버 사이드 렌더링 시 주의**
   - SSR 환경에서는 에러 바운더리가 제한적으로 작동할 수 있습니다

## 스토리북 예제

더 많은 예제는 스토리북에서 확인할 수 있습니다:

```bash
pnpm --filter storybook dev
```

브라우저에서 `http://localhost:6006`으로 접속하여 "Components/ErrorBoundary" 섹션을 확인하세요.

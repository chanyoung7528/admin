# ErrorBoundary 적용 가이드 - my-app

## 개요

my-app 프로젝트에 `react-error-boundary` 기반의 선언형 ErrorBoundary가 적용되었습니다.

## 적용된 계층 구조

```
__root.tsx (최상위)
├── ErrorBoundary (default, showHomeButton)
│   ├── _authenticated.tsx
│   │   ├── ErrorBoundary (minimal) → Header
│   │   └── ErrorBoundary (default) → 페이지 콘텐츠
│   └── _public.tsx
│       └── ErrorBoundary (default, showHomeButton)
```

## 1. 최상위 레벨 (\_\_root.tsx)

전체 애플리케이션을 감싸는 최상위 에러 바운더리입니다.

```tsx
// apps/my-app/src/pages/__root.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function RootComponent() {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallback="default"
      showHomeButton={true}
      onError={(error, info) => {
        console.error('🚨 Root Level Error:', error);
        console.error('Component Stack:', info.componentStack);
        // TODO: Sentry.captureException(error, { ... });
      }}
      onReset={() => {
        router.navigate({ to: '/' });
      }}
    >
      <Outlet />
    </ErrorBoundary>
  );
}
```

### 특징

- **fallback**: `default` - 전체 화면 에러 표시
- **showHomeButton**: `true` - 홈 버튼 표시
- **onError**: 에러 로깅 (Sentry 등으로 전송)
- **onReset**: 에러 리셋 시 홈으로 이동

## 2. 인증 레이아웃 (\_authenticated.tsx)

인증된 사용자만 접근 가능한 페이지의 레이아웃입니다.

```tsx
// apps/my-app/src/pages/_authenticated.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function AuthenticatedLayout() {
  return (
    <Layout>
      {/* Header 에러 바운더리 */}
      <ErrorBoundary
        fallback="minimal"
        onError={error => {
          console.error('Header Error:', error);
        }}
      >
        <Header />
      </ErrorBoundary>

      {/* 메인 콘텐츠 에러 바운더리 */}
      <ErrorBoundary
        fallback="default"
        title="페이지 로딩 실패"
        description="페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요."
        onError={(error, info) => {
          console.error('Authenticated Page Error:', error);
        }}
      >
        <Outlet />
      </ErrorBoundary>
    </Layout>
  );
}
```

### 특징

- **Header**: `minimal` 폴백 - 헤더 에러 시 작은 에러 메시지만 표시
- **Content**: `default` 폴백 - 페이지 콘텐츠 에러 시 전체 화면 에러 표시
- **독립성**: Header 에러가 발생해도 페이지 콘텐츠는 정상 표시

## 3. 공개 레이아웃 (\_public.tsx)

인증 없이 접근 가능한 공개 페이지의 레이아웃입니다.

```tsx
// apps/my-app/src/pages/_public.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <ErrorBoundary
        fallback="default"
        title="페이지 로딩 실패"
        description="페이지를 불러오는 중 문제가 발생했습니다."
        showHomeButton={true}
        onError={(error, info) => {
          console.error('Public Page Error:', error);
        }}
      >
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
```

## 4. 페이지 레벨 (dashboard.tsx 예시)

개별 페이지에서 도메인 컴포넌트별로 에러 바운더리를 적용합니다.

```tsx
// apps/my-app/src/pages/_authenticated/my-body/dashboard.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function BodyDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Dashboard 도메인 */}
      <ErrorBoundary
        fallback="simple"
        onError={error => {
          console.error('Dashboard View Error:', error);
        }}
      >
        <DashboardView service="BODY" />
      </ErrorBoundary>

      {/* Monitoring 도메인 */}
      <ErrorBoundary
        fallback="simple"
        onError={error => {
          console.error('Monitoring Panel Error:', error);
        }}
      >
        <MonitoringPanel service="BODY" />
      </ErrorBoundary>
    </div>
  );
}
```

### 특징

- **도메인별 독립성**: DashboardView 에러 발생 시에도 MonitoringPanel은 정상 표시
- **simple 폴백**: 인라인 박스 형태의 에러 UI
- **세밀한 제어**: 각 섹션별로 독립적인 에러 처리

## 폴백 스타일 선택 가이드

### `fallback="default"`

- **사용 위치**: 페이지 전체, 최상위 레벨
- **특징**: 전체 화면 에러 페이지, 상세 정보 포함
- **예시**: Root, Page Content

### `fallback="simple"`

- **사용 위치**: 섹션, 도메인 컴포넌트
- **특징**: 인라인 박스 형태, 중간 크기
- **예시**: DashboardView, MonitoringPanel

### `fallback="minimal"`

- **사용 위치**: Header, 작은 UI 요소
- **특징**: 한 줄 에러 메시지, 최소한의 공간
- **예시**: Header, Small Widgets

## 에러 로깅 설정

### 개발 환경

```tsx
onError={(error, info) => {
  console.error('Error:', error);
  console.error('Component Stack:', info.componentStack);
}
```

### 프로덕션 환경 (TODO)

```tsx
import * as Sentry from '@sentry/react';

onError={(error, info) => {
  // Sentry로 에러 전송
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: info.componentStack,
      },
    },
    tags: {
      layer: 'root', // 'page', 'component'
    },
  });
}
```

## 비동기 에러 처리

API 호출 등 비동기 작업의 에러는 `useErrorHandler` 훅을 사용합니다.

```tsx
import { useErrorHandler } from '@repo/shared/components/ui';

function MyComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('API 요청 실패');
      return await response.json();
    } catch (error) {
      handleError(error); // ErrorBoundary로 에러 전달
    }
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
}
```

## 테스트 방법

### 1. 개발 환경에서 의도적으로 에러 발생시키기

```tsx
// 임시로 컴포넌트에 추가
function TestErrorComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('테스트 에러입니다!');
  }

  return <button onClick={() => setShouldError(true)}>에러 발생시키기</button>;
}
```

### 2. React DevTools에서 확인

- Error Boundary가 제대로 작동하는지 확인
- 컴포넌트 트리에서 에러 바운더리 위치 확인

### 3. 콘솔에서 에러 로그 확인

- 각 레벨에서 발생한 에러 로그 확인
- Component Stack 정보 확인

## 모범 사례

### ✅ DO

1. **계층적 적용**: Root → Layout → Page → Component
2. **독립성 보장**: 중요 섹션별로 별도 에러 바운더리
3. **적절한 폴백**: 위치에 맞는 폴백 스타일 선택
4. **에러 로깅**: 모든 에러 바운더리에 onError 콜백 추가
5. **의미있는 메시지**: 사용자가 이해할 수 있는 에러 메시지

### ❌ DON'T

1. **과도한 사용**: 모든 작은 컴포넌트마다 에러 바운더리
2. **에러 숨기기**: 에러를 로깅하지 않고 무시
3. **제네릭 메시지**: "에러 발생" 같은 모호한 메시지
4. **복구 불가능**: onReset 콜백 없이 사용자를 막다른 골목으로

## 다음 단계

1. [ ] Sentry 통합하여 프로덕션 에러 모니터링
2. [ ] 커스텀 에러 페이지 디자인 개선
3. [ ] 에러 발생 시 사용자 피드백 수집
4. [ ] 에러 통계 대시보드 구축
5. [ ] 자동 에러 리포팅 시스템 구축

## 관련 문서

- `/packages/shared/ERROR_BOUNDARY_GUIDE.md` - 전체 API 가이드
- `/packages/shared/ERROR_BOUNDARY_EXAMPLES.md` - 실제 사용 예제
- Storybook - `http://localhost:6006` - 인터랙티브 예제

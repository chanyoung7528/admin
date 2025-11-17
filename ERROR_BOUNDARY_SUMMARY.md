# ErrorBoundary 적용 완료 요약

## ✅ 완료된 작업

### 1. 패키지 설치

- `@repo/shared`에 `react-error-boundary@6.0.0` 설치

### 2. ErrorBoundary 컴포넌트 생성

**위치**: `/packages/shared/src/components/ui/error-boundary.tsx`

**기능**:

- 3가지 폴백 스타일: `default`, `simple`, `minimal`
- 커스텀 폴백 컴포넌트 지원
- `useErrorHandler` 훅 제공 (비동기 에러 처리)
- 에러 로깅 콜백 (`onError`)
- 에러 리셋 콜백 (`onReset`)

### 3. my-app에 ErrorBoundary 적용

#### 📁 \_\_root.tsx (최상위)

```tsx
<ErrorBoundary
  fallback="default"
  showHomeButton={true}
  onError={(error, info) => {
    /* 에러 로깅 */
  }}
  onReset={() => router.navigate({ to: '/' })}
>
  <Outlet />
</ErrorBoundary>
```

#### 📁 \_authenticated.tsx (인증 레이아웃)

```tsx
<Layout>
  {/* Header */}
  <ErrorBoundary fallback="minimal">
    <Header />
  </ErrorBoundary>

  {/* Content */}
  <ErrorBoundary fallback="default" title="페이지 로딩 실패">
    <Outlet />
  </ErrorBoundary>
</Layout>
```

#### 📁 \_public.tsx (공개 레이아웃)

```tsx
<ErrorBoundary fallback="default" showHomeButton={true} title="페이지 로딩 실패">
  <Outlet />
</ErrorBoundary>
```

#### 📁 dashboard.tsx (페이지 예시)

```tsx
{/* 도메인별 독립적인 에러 바운더리 */}
<ErrorBoundary fallback="simple">
  <DashboardView service="BODY" />
</ErrorBoundary>

<ErrorBoundary fallback="simple">
  <MonitoringPanel service="BODY" />
</ErrorBoundary>
```

### 4. 스토리북 문서화

**위치**: `/apps/storybook/src/stories/ErrorBoundary.stories.tsx`

**포함된 예제**:

1. Default - 기본 폴백 스타일
2. Simple - 심플한 폴백 스타일
3. Minimal - 최소한의 폴백 스타일
4. AsyncError - 비동기 에러 처리
5. CustomFallback - 커스텀 폴백 UI
6. WithErrorLogging - 에러 로깅
7. Nested - 중첩된 에러 바운더리
8. FormError - 폼 제출 에러
9. DashboardLayout - 대시보드 레이아웃 예제

### 5. 문서 작성

- `/packages/shared/ERROR_BOUNDARY_GUIDE.md` - 전체 API 가이드
- `/packages/shared/ERROR_BOUNDARY_EXAMPLES.md` - 실제 프로젝트 예제
- `/apps/my-app/ERROR_BOUNDARY_IMPLEMENTATION.md` - my-app 적용 가이드

## 📊 적용 계층 구조

```
__root.tsx (Root Level)
├── ErrorBoundary [default, showHomeButton]
│   ├── _authenticated.tsx (Auth Layout)
│   │   ├── ErrorBoundary [minimal] → Header
│   │   └── ErrorBoundary [default] → Page Content
│   │       └── dashboard.tsx (Page)
│   │           ├── ErrorBoundary [simple] → DashboardView
│   │           └── ErrorBoundary [simple] → MonitoringPanel
│   └── _public.tsx (Public Layout)
│       └── ErrorBoundary [default, showHomeButton]
```

## 🎨 폴백 스타일 가이드

### Default (`fallback="default"`)

- **용도**: 페이지 전체, 최상위 레벨
- **특징**: 전체 화면, 상세 정보, 홈 버튼 옵션
- **위치**: Root, Page Layout

### Simple (`fallback="simple"`)

- **용도**: 섹션, 도메인 컴포넌트
- **특징**: 인라인 박스, 중간 크기
- **위치**: Dashboard, Monitoring Panel

### Minimal (`fallback="minimal"`)

- **용도**: Header, 작은 UI 요소
- **특징**: 한 줄 메시지, 최소 공간
- **위치**: Header, Small Widgets

## 🔧 사용 방법

### 기본 사용

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

<ErrorBoundary fallback="default">
  <YourComponent />
</ErrorBoundary>;
```

### 비동기 에러 처리

```tsx
import { ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';

function AsyncComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('API 요청 실패');
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
}
```

### 에러 로깅

```tsx
<ErrorBoundary
  fallback="default"
  onError={(error, info) => {
    console.error('Error:', error);
    console.error('Component Stack:', info.componentStack);
    // TODO: Sentry.captureException(error, { ... });
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## ✅ 검증 완료

### 타입 체크

```bash
✓ packages/shared: pnpm type-check
✓ apps/storybook: pnpm type-check
✓ apps/my-app: pnpm type-check
```

### 빌드

```bash
✓ apps/storybook: pnpm build
✓ apps/my-app: pnpm build
```

### 린터

```bash
✓ No linter errors
```

## 🎯 다음 단계 (TODO)

1. **Sentry 통합**

   ```tsx
   import * as Sentry from '@sentry/react';

   onError={(error, info) => {
     Sentry.captureException(error, {
       contexts: { react: { componentStack: info.componentStack } }
     });
   }
   ```

2. **커스텀 에러 페이지**
   - 브랜드에 맞는 에러 페이지 디자인
   - 유용한 액션 버튼 추가
   - 사용자 피드백 수집

3. **에러 모니터링 대시보드**
   - 에러 발생 추이 분석
   - 가장 많이 발생하는 에러 파악
   - 사용자 영향도 측정

4. **자동 복구 메커니즘**
   - 네트워크 에러 자동 재시도
   - 상태 복원 로직
   - 부분 데이터 로드

## 📚 참고 문서

### 프로젝트 내부

- `/packages/shared/ERROR_BOUNDARY_GUIDE.md`
- `/packages/shared/ERROR_BOUNDARY_EXAMPLES.md`
- `/apps/my-app/ERROR_BOUNDARY_IMPLEMENTATION.md`

### 스토리북

```bash
cd apps/storybook
pnpm dev
# http://localhost:6006 → "UI Components/ErrorBoundary"
```

### 외부 문서

- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

## 🎉 완료!

my-app 프로젝트에 선언형 ErrorBoundary가 성공적으로 적용되었습니다!

**주요 이점**:

- ✅ 전체 앱 충돌 방지
- ✅ 세밀한 에러 제어
- ✅ 사용자 경험 개선
- ✅ 에러 로깅 및 모니터링 준비
- ✅ 독립적인 컴포넌트 에러 처리

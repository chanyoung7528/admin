# ErrorBoundary 적용 가이드 (my-app)

## 개요

`my-app`은 `@repo/shared/components/ui`의 `ErrorBoundary`를 사용합니다.

- 기반: `react-error-boundary`
- 폴백: `default | simple | minimal` 또는 커스텀 컴포넌트
- 비동기/이벤트 핸들러 에러 전달: `useErrorHandler()`

---

## 현재 적용 구조(현 코드 기준)

```text
__root.tsx
└── ErrorBoundary(fallback=default)
    ├── _authenticated.tsx
    │   ├── ErrorBoundary(fallback=minimal)  # Header
    │   └── ErrorBoundary(fallback=default)  # Page Content
    └── _public.tsx
        └── ErrorBoundary(fallback=default)
```

---

## `ErrorBoundary` API 요약

### Props

- `fallback`: `'default' | 'simple' | 'minimal' | React.ComponentType<FallbackProps>`
- `title`, `description`: `fallback="default"`일 때 표시 텍스트
- `showHomeButton`: `fallback="default"`일 때 홈 버튼 표시
- `onError(error, info)`: 에러 로깅 훅
- `onReset()`: reset 시 추가 동작(예: 라우트 이동)

---

## 레벨별 적용 가이드

### 1. 앱 최상위(`__root.tsx`)

- 앱 전체 크래시 방지
- reset 시 홈으로 복구

### 2. 레이아웃 레벨(`_authenticated.tsx`, `_public.tsx`)

- Header와 Content를 분리해 **부분 복구**가 가능하도록 구성

### 3. 페이지/섹션 레벨(선택)

도메인 위젯/섹션이 무거운 경우, 섹션 단위로 `fallback="simple"`을 추가해 **부분 장애 격리**를 할 수 있습니다.

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

export function ExampleSection() {
  return (
    <ErrorBoundary fallback="simple" onError={error => console.error('Section Error:', error)}>
      <div>섹션 콘텐츠</div>
    </ErrorBoundary>
  );
}
```

---

## 비동기/이벤트 에러 처리

렌더링 외(이벤트 핸들러/비동기 함수)에서 발생한 에러는 `useErrorHandler()`로 ErrorBoundary에 전달합니다.

```tsx
import { useErrorHandler } from '@repo/shared/components/ui';

export function Example() {
  const handleError = useErrorHandler();

  const onClick = async () => {
    try {
      throw new Error('TEST_ERROR');
    } catch (error) {
      handleError(error);
    }
  };

  return <button onClick={onClick}>에러 발생</button>;
}
```

---

## 테스트 방법

- 특정 컴포넌트에서 의도적으로 `throw new Error(...)` 발생
- 각 레벨(루트/레이아웃/섹션)의 폴백 UI가 의도대로 나오는지 확인
- `onError` 로그가 남는지 확인

## 참고

- `packages/shared/src/components/ui/error-boundary.tsx`
- Storybook: `apps/storybook`의 ErrorBoundary 스토리

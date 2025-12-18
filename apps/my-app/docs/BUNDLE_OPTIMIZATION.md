# 번들 크기 최적화 가이드 (my-app)

## 목표

- **초기 로딩 최소화**: 첫 화면에 필요한 코드만 로드
- **캐시 효율 극대화**: 변경이 적은 라이브러리는 별도 청크로 분리
- **프로덕션 번들에서 개발 도구 제거**

---

## 현재 적용된 최적화(현 코드 기준)

### 1. Vendor/도메인 단위 코드 스플리팅

`apps/my-app/vite.config.ts`의 `build.rollupOptions.output.manualChunks`에서 아래 기준으로 청크를 분리합니다.

- **React 코어**: `react-vendor`
- **UI 라이브러리**(Radix UI, Lucide): `ui-vendor`
- **차트**(Recharts/d3): `chart-vendor`
- **앱 코어 계층**(TanStack Router/Query/Table, axios, zustand): `app-vendor`
- **UI 유틸**(react-hook-form, zod, date-fns, lodash-es 등): `ui-utils-vendor`
- **기타 node_modules**: `vendor`
- **도메인 코드**: `domain-auth`, `domain-dashboard`, `domain-settlement`, `domain-my-food`
- **shared 패키지**: `shared-ui`, `shared`

### 2. 개발 도구 동적 임포트

프로덕션 번들에 Devtools가 포함되지 않도록 `VITE_FEATURE_DEBUG=true`일 때만 동적으로 로드합니다.

- Router Devtools: `src/pages/__root.tsx`
- React Query Devtools: `src/main.tsx`

### 3. 프로덕션 빌드 최적화

- **minify**: `esbuild`
- **CSS code splitting**: 활성화
- **console/debugger 제거**: `VITE_FEATURE_DEBUG=false`일 때 `esbuild.pure/drop` 적용

### 4. 번들 분석 리포트 생성

빌드 시 `apps/my-app/dist/stats.html`가 생성됩니다. (`rollup-plugin-visualizer`)

---

## 번들 분석 방법

```bash
# my-app 빌드
pnpm build:my-app

# 리포트 열기
open apps/my-app/dist/stats.html
```

확인 포인트:

- **가장 큰 청크/패키지**가 무엇인지
- **중복 포함**(React 중복 등)이 없는지
- **lazy route 전환 후보**(초기 라우트에 불필요하게 포함된 큰 도메인/위젯)

---

## 추가 최적화 가이드

### 1. 라우트 단위 Lazy Loading

TanStack Router 파일 기반 라우팅에서는 큰 페이지를 `*.lazy.tsx`로 분리해 초기 번들에서 제외할 수 있습니다.

- 적용 예: `src/pages/_authenticated/index.lazy.tsx`
- 후보 예: 정산 상세/등록 등 초기 화면에 불필요한 페이지

### 2. 조건부 UI/기능의 Dynamic Import

모달/차트/에디터처럼 "특정 상황"에만 등장하는 UI는 컴포넌트 레벨에서 동적 임포트를 고려합니다.

```tsx
import { lazy, Suspense, useState } from 'react';

const HeavyWidget = lazy(() => import('./HeavyWidget'));

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      {open ? (
        <Suspense fallback={null}>
          <HeavyWidget />
        </Suspense>
      ) : null}
    </>
  );
}
```

### 3. Tailwind CSS(v4) 소스 스캔 범위 관리

이 프로젝트는 `packages/shared/src/styles/globals.css`에서 `@source`로 스캔 범위를 관리합니다.

- 불필요한 경로가 넓게 잡히면 CSS가 커질 수 있으니, `@source` 경로를 **실제 사용하는 소스 범위로 유지**합니다.

---

## 체크리스트

- [ ] `pnpm build:my-app` 후 `dist/stats.html`로 큰 의존성/청크 확인
- [ ] 초기 라우트(대시보드)에 불필요한 무거운 위젯 포함 여부 확인
- [ ] 큰 페이지는 `*.lazy.tsx`로 전환 검토
- [ ] 조건부 컴포넌트는 dynamic import로 전환 검토
- [ ] `VITE_FEATURE_DEBUG`에 따라 Devtools/console 제거가 의도대로 동작하는지 확인

## 참고

- [Vite - Build](https://vite.dev/guide/build.html)
- [TanStack Router - Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)
- [React - Code Splitting](https://react.dev/reference/react/lazy)

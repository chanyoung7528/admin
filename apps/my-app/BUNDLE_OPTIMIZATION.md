# 번들 크기 최적화 가이드

## 현재 최적화 결과

### 최적화 전

- **단일 파일**: 535.56 KB (gzip: 159.47 KB)

### 최적화 후

- **vendor.js**: 0.66 KB (gzip: 0.41 KB) - zustand, axios
- **react-vendor.js**: 11.79 KB (gzip: 4.21 KB) - React, ReactDOM
- **tanstack-vendor.js**: 106.18 KB (gzip: 33.30 KB) - TanStack Router, Query
- **index.js**: 416.85 KB (gzip: 122.83 KB) - 앱 코드
- **총 gzip 크기**: 160.75 KB

## 적용된 최적화

### 1. 코드 스플리팅 (Code Splitting)

- React 관련 라이브러리를 별도 청크로 분리
- TanStack 라이브러리를 별도 청크로 분리
- 기타 vendor 라이브러리 분리

**장점:**

- 브라우저 캐싱 효율 향상
- 라이브러리 업데이트 시 앱 코드는 캐시 유지
- 병렬 다운로드로 초기 로딩 속도 개선

### 2. 개발 도구 동적 임포트

- ReactQueryDevtools: 프로덕션 빌드에서 제외
- TanStackRouterDevtools: 프로덕션 빌드에서 제외

### 3. 빌드 최적화 설정

- esbuild를 사용한 minification
- CSS 코드 스플리팅 활성화
- 소스맵 제거 (프로덕션)
- Tree shaking 자동 적용

## 추가 최적화 방안

### 1. 라우트 기반 Lazy Loading

페이지별로 지연 로딩을 적용하면 초기 로딩 크기를 더 줄일 수 있습니다.

```typescript
// 예시: pages/my-food/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// 컴포넌트를 lazy로 감싸기
const DashboardView = lazy(() =>
  import("@/domains/dashboard/components/DashboardView").then(m => ({
    default: m.DashboardView
  }))
);

export const Route = createFileRoute("/my-food/dashboard")({
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardView />
    </Suspense>
  ),
});
```

### 2. 무거운 라이브러리 대체

현재 번들 분석 리포트(`dist/stats.html`)를 열어서 큰 용량을 차지하는 라이브러리를 확인하세요.

**고려사항:**

- 사용하지 않는 라이브러리 제거
- 가벼운 대안으로 교체 (예: moment.js → date-fns 또는 dayjs)
- Tree-shakeable한 라이브러리 선택

### 3. 이미지 최적화

```typescript
// vite.config.ts에 이미지 최적화 플러그인 추가
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    // ... 기존 플러그인
    imagetools(),
  ],
});
```

### 4. Dynamic Import 패턴

자주 사용하지 않는 기능은 동적으로 로드:

```typescript
// 모달, 차트 등 조건부로 보여지는 컴포넌트
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>차트 보기</button>
      {showChart && (
        <Suspense fallback={<Spinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

### 5. CSS 최적화

Tailwind CSS를 사용 중이므로 불필요한 클래스가 포함되지 않도록 설정 확인:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/shared/src/**/*.{js,ts,jsx,tsx}'],
  // ... 나머지 설정
};
```

## 번들 분석

빌드 후 생성된 `dist/stats.html` 파일을 열어서:

1. 가장 큰 용량을 차지하는 패키지 확인
2. 중복 포함된 패키지 확인
3. Tree shaking이 제대로 작동하는지 확인

```bash
# 빌드 후 자동으로 분석 리포트 열기
pnpm run build
open apps/my-app/dist/stats.html
```

## 성능 모니터링

### Lighthouse 점수 확인

```bash
pnpm run build
pnpm run preview
# Chrome DevTools > Lighthouse 실행
```

### 번들 크기 제한 설정

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // ... 기존 설정
        },
      },
    },
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 500, // KB
  },
});
```

## 체크리스트

- [x] 코드 스플리팅 적용
- [x] 개발 도구 동적 임포트
- [x] 빌드 최적화 설정
- [x] 번들 분석 도구 설치
- [ ] 라우트별 lazy loading 적용
- [ ] 무거운 라이브러리 확인 및 대체
- [ ] 이미지 최적화 적용
- [ ] Lighthouse 성능 점수 확인

## 참고 자료

- [Vite Build Optimizations](https://vite.dev/guide/build.html)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [TanStack Router Code Splitting](https://tanstack.com/router/latest/docs/framework/react/guide/code-splitting)

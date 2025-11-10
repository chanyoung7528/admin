# 번들 크기 분석 결과

## 현재 빌드 파일 크기

```
412K - index-DdTqnIKX.js (앱 코드 + 기타 라이브러리)
104K - tanstack-vendor-BcoaNIkb.js (TanStack Router + Query)
 64K - index-BkylTbfJ.css (Tailwind CSS)
 12K - react-vendor-Bzgz95E1.js (React + ReactDOM)
  8K - index-ClKPa7us.js
  4K - vendor-CgbjetqP.js (zustand, axios)
  4K - index-Dho7K2ld.js
```

## 용량을 많이 차지하는 주요 라이브러리 (추정)
1. 🟡 **@radix-ui 패키지들** (~100KB)
현재 사용 중:
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-collapsible
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-tooltip

**해결방법**: 
- 사용하지 않는 Radix UI 컴포넌트 제거
- 실제로 사용하는 컴포넌트만 import

### 3. 🟡 **TanStack Router** (~70-80KB)
- 이미 별도 청크로 분리됨 ✅
- routeTree.gen.ts 파일이 클 수 있음 (페이지 수에 비례)

### 4. 🟡 **TanStack Query** (~30-40KB)
- 이미 별도 청크로 분리됨 ✅

### 5. 🟢 **기타**
- axios: ~14KB (작음)
- zustand: ~3KB (매우 작음)
- class-variance-authority: ~5KB
- clsx: ~1KB
- tailwind-merge: ~10KB

## 즉시 적용 가능한 최적화
3. Tree Shaking 개선

vite.config.ts에 추가:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "tanstack-vendor": ["@tanstack/react-router", "@tanstack/react-query"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            // 실제 사용하는 것만 추가
          ],
          vendor: ["axios", "zustand"],
        },
      },
    },
  },
  // Tree shaking 최적화
  optimizeDeps: {
    exclude: ["lucide-react"], // 직접 import 사용 시
  },
});
```

## 예상 개선 효과

| 최적화 항목 | 예상 절감 | 난이도 |
|-----------|----------|--------|
| lucide-react 개선 | ~100-150KB | 중 |
| 미사용 Radix UI 제거 | ~20-50KB | 쉬움 |
| 모든 페이지 lazy loading | ~50-100KB (초기 로딩) | 중 |
| UI vendor 청크 분리 | 캐싱 개선 | 쉬움 |

**총 예상 개선**: 170-300KB (30-50% 감소)

## 번들 분석 확인 방법

1. **시각적 분석**:
```bash
open /Users/mz01-chansm/Desktop/side-project/admin/apps/my-app/dist/stats.html
```

2. **명령줄 분석**:
```bash
cd /Users/mz01-chansm/Desktop/side-project/admin/apps/my-app
du -sh dist/assets/* | sort -h
```

3. **Source Map Explorer** (더 상세한 분석):
```bash
pnpm add -D source-map-explorer
pnpm run build
npx source-map-explorer 'dist/assets/*.js'
```

## 다음 단계

1. [x] 번들 분석 완료
2. [ ] lucide-react 최적화 적용
3. [ ] 미사용 Radix UI 컴포넌트 제거
4. [ ] 모든 페이지에 lazy loading 적용
5. [ ] 재빌드 후 크기 비교

## 참고

- 브라우저에 열린 `stats.html`에서 각 라이브러리의 정확한 크기를 확인할 수 있습니다
- 마우스로 각 블록을 클릭하면 상세 정보가 표시됩니다


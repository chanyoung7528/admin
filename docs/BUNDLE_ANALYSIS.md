# 번들 분석 및 최적화 가이드

## 1. 현재 빌드 스냅샷 (2025-11-28)

`apps/my-app/dist/assets` 기준

| 파일                                     | 크기       | 설명                                   |
| ---------------------------------------- | ---------- | -------------------------------------- |
| `index-lTy2agqc.js`                      | **1.2 MB** | 애플리케이션 본체 (페이지/도메인 코드) |
| `tanstack-vendor-Cuwiek6D.js`            | 108 KB     | Router + Query 번들                    |
| `index-C84G8vaz.css`                     | 81 KB      | Tailwind + Shadcn 스타일               |
| `BaseTanStackRouterDevtools*.js`         | 37 KB      | DevTools(동적 import)                  |
| `FloatingTanStackRouterDevtools*.js`     | 19 KB      | DevTools 서브 패널                     |
| `react-vendor-OvXVS5lI.js`               | 11 KB      | React + DOM                            |
| `vendor-CJBMpuhP.js`                     | 36 KB      | axios, zustand 등 기타 라이브러리      |
| `index-CTSpGF5Z.js`, `index-zioTSqyj.js` | 소형       | 라우터 부수 파일                       |

> DevTools 번들은 `env.isDebug` 조건으로만 로드됩니다. 프로덕션에서 `VITE_FEATURE_DEBUG=false` 여야 합니다.

## 2. 이미 적용된 최적화

- `apps/my-app/vite.config.ts`
  - `manualChunks` 로 `react-vendor`, `tanstack-vendor`, `vendor` 분리
  - `visualizer` 플러그인으로 `dist/stats.html` 생성
  - `esbuild.pure`/`drop` 로 `console.*`, `debugger` 제거
- `src/main.tsx` / `pages/__root.tsx`
  - React Query DevTools / Router DevTools 를 `lazy` + `Suspense` 로 감싸 프로덕션 번들에서 제외

## 3. 추가 최적화 아이디어

| 작업                | 설명                                                     | 비고                                         |
| ------------------- | -------------------------------------------------------- | -------------------------------------------- |
| 라우트 Lazy Loading | 페이지 단위 `lazy(() => import())` 적용                  | TanStack Router에 `loader` + `lazy` API 사용 |
| 미사용 Radix 제거   | `packages/shared` 에서 쓰지 않는 UI import 삭제          | `pnpm ls @radix-ui/*` 로 확인                |
| 아이콘 청크 줄이기  | `lucide-react` Tree Shaking 확인, 필요한 아이콘만 import | 불필요한 `lucide-react/` export 사용 금지    |
| CSS 모듈화          | 대규모 컴포넌트의 CSS를 지연 로딩 (예: Chart, FormTable) | 현재는 단일 CSS 청크                         |

## 4. stats.html 보는 법

```bash
pnpm run build:my-app
open apps/my-app/dist/stats.html
```

- `react-vendor`: React / ReactDOM / scheduler
- `tanstack-vendor`: `@tanstack/react-router`, `@tanstack/react-query`
- `vendor`: axios, zustand 등 기타 공통 라이브러리
- `index-*.js`: 앱 코드. 해당 영역이 너무 크다면 lazy 로 분리할 후보입니다.

## 5. CLI로 파일 크기 확인

```bash
cd apps/my-app
du -h dist/assets/* | sort -h
```

추가로 `pnpm add -D source-map-explorer` 후 개별 청크 분석도 가능합니다.

## 6. 체크리스트

- [ ] 새로운 페이지/도메인 추가 시 `lazy import` 가능 여부 검토
- [ ] DevTools 관련 플래그(`VITE_FEATURE_DEBUG`)를 프로덕션에서 항상 `false`
- [ ] `react-vendor` / `tanstack-vendor` 외에 덩치가 큰 패키지는 `manualChunks` 로 추가 분리
- [ ] Storybook 컴포넌트가 앱 번들에 포함되지 않도록 `apps/my-app` 에서 import 금지

## 7. 참고

- `docs/APP_DEPLOYMENT.md` : 빌드/배포 파이프라인
- `apps/my-app/vite.config.ts` : 최신 최적화 설정
- `apps/my-app/dist/stats.html` : 실제 의존성 트리 시각화

## 🧱 앱 아키텍처

### 1. 전반 개요

- `apps/my-app` 은 React 19 + TanStack Router 조합으로 구성되며, URL 상태와 테이블 상태는 `packages/shared/src/components/data-table/useTableUrlState.ts` 를 통해 동기화합니다.
- 모든 화면은 도메인 디렉터리(`apps/my-app/src/domains/*`)의 컴포넌트/훅/서비스를 조합해 구성합니다.
- 공통 레이아웃과 ErrorBoundary 계층은 `apps/my-app/src/pages/__root.tsx`, `/_authenticated.tsx`, `/_public.tsx` 세 파일에서 정의됩니다.

### 2. 도메인 카탈로그

| 도메인                                             | 위치                           | 비고                                              |
| -------------------------------------------------- | ------------------------------ | ------------------------------------------------- |
| `auth`                                             | `apps/my-app/src/domains/auth` | 로그인 폼, Zustand 스토어, axios 연동             |
| `dashboard`                                        | `.../dashboard`                | `DashboardView`, `Header` 등 서비스별 대시보드    |
| `monitoring`                                       | `.../monitoring`               | `MonitoringPanel`, `ErrorLogViewer`               |
| `settlement`                                       | `.../settlement`               | Faker 기반 데이터 + DataTable (`SettlementTable`) |
| `report`                                           | `.../report`                   | 리포트 섹션 스텁                                  |
| `inquiry`                                          | `.../inquiry`                  | 문의 목록/답변 폼                                 |
| `insight`                                          | `.../insight`                  | 메인 대시보드 상단 인사이트 카드                  |
| `order`                                            | `.../order`                    | 발주/재고 테이블 준비용 스켈레톤                  |
| `billing`, `site`, `content`, `user`, `my-food` 등 | 필요 시 조립되는 구성요소      |

> `user` 도메인의 `UserListTable.tsx` 는 현재 TODO 상태이며, DataTable 도입 전 UI 틀만 존재합니다.

### 3. 라우터 계층

```
__root.tsx
├─ ErrorBoundary (fallback=default)
│  ├─ LoadingPageOverlay (React Query fetching)
│  └─ TanStackRouterDevtools (env.isDebug일 때만 동적 import)
└─ Outlet
   ├─ _authenticated (Layout + Header + Outlet)
   └─ _public (퍼블릭 페이지 컨테이너)
```

- `/_authenticated` 라우트는 `beforeLoad` 에서 `useAuthStore.getState()`를 읽어 인증 여부를 검사하고, 실패 시 `/login` 으로 redirect합니다.
- `/_public` 은 인증 없이 접근 가능한 라우트를 담으며, 내부에서도 ErrorBoundary를 한 번 더 감쌉니다.

#### 등록된 자식 라우트 (발췌)

| 경로                                 | 파일                                             | 주요 콘텐츠                                         |
| ------------------------------------ | ------------------------------------------------ | --------------------------------------------------- |
| `/_authenticated/`                   | `apps/my-app/src/pages/_authenticated/index.tsx` | `InsightDashboard` + `DashboardView(service="ALL")` |
| `/_authenticated/user/list`          | `.../user/list.tsx`                              | 향후 DataTable 예정 (`UserListTable`)               |
| `/_authenticated/my-food/dashboard`  | `.../my-food/dashboard.tsx`                      | `DashboardView` + `MonitoringPanel`                 |
| `/_authenticated/my-food/settlement` | `.../my-food/settlement.tsx`                     | `SettlementTable` + `zod` 기반 검색 스키마          |
| `/_authenticated/report/`            | `.../report/index.tsx`                           | API 호출 예시 + UI placeholder                      |
| `/_public/login`                     | `apps/my-app/src/pages/_public/login.tsx`        | `LoginForm` 로컬 검증 + 성공 시 redirect            |

> Body/Mind 전용 페이지는 현재 존재하지 않으며, Food 라인을 기준으로 구조를 확장할 계획입니다.

### 4. 데이터 흐름

1. **라우트**  
   `createFileRoute` → `validateSearch(zod)` → 페이지 컴포넌트
2. **도메인 훅**  
   페이지는 `useSettlementTable`, `useLogin`, `useLogout` 등 도메인 전용 훅을 호출합니다.
3. **공용 컨트롤러**  
   `useDataTableController` 는 URL 검색값, pagination, columnFilters를 React Query 파라미터로 변환합니다.
4. **서비스/패키지**
   - API 요청은 `packages/core/api` 의 `api` 인스턴스로 통일.
   - ErrorBoundary, Layout, DataTable 등은 `packages/shared` 에서 가져옵니다.

### 5. URL & 테이블 상태

- URL 상태는 `useTableUrlState` 가 단일 출처(Single Source of Truth)입니다.
- `apps/my-app/src/pages/_authenticated/my-food/settlement.tsx` 는 `validateSearch` 로 page/pageSize/status/filter를 파싱하고, 같은 키를 DataTable 컨트롤러와 shared 훅에서 재사용합니다.
- `packages/shared/src/components/data-table/hooks/useDataTableState.ts` 는 `pageCount ?? -1`, `manualPagination` 설정으로 서버 사이드 페이지네이션을 활성화합니다.

### 6. ErrorBoundary 계층 (요약)

- Root: 전체 앱 보호, `onError` 로 스택 로깅 후 홈 이동
- Authenticated Layout: Header(`fallback="minimal"`)와 본문(`fallback="default"`)을 분리
- Public Layout: 로그인/소개 페이지를 위한 단일 Boundary
- 페이지 단: 예시로 `apps/my-app/src/pages/_authenticated/my-food/dashboard.tsx` 에서 도메인별 Boundary 를 씌울 수 있습니다.

자세한 사례는 `docs/ERROR_BOUNDARY.md` 에서 확인하세요.

### 7. 향후 작업 메모

- `UserListTable`, `OrderList`, `ReportSection` 등은 현재 UI placeholder → DataTable 마이그레이션이 필요합니다.
- `routeTree.gen.ts` 는 TanStack Router 플러그인이 자동 생성하므로 수동 수정 금지입니다.
- 새 도메인을 추가할 때는 `apps/my-app/src/domains/<domain>/{components,hooks,services}` 구조와 `index.ts` re-export 규칙을 반드시 지켜주세요.

### 8. 참고 문서

- 배포/빌드: `docs/APP_DEPLOYMENT.md`, `docs/BUNDLE_ANALYSIS.md`
- 테이블: `docs/DATA_TABLE_IMPLEMENTATION.md`, `docs/DATA_TABLE_PAGINATION.md`
- 인증: `docs/API_AUTH_INTEGRATION.md`, `docs/ROUTE_AUTH_GUIDE.md`
- Mock 데이터: `docs/FAKER_SETUP.md`

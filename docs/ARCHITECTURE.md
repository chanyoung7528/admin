# 🏗️ Admin Dashboard Architecture

## 개요

이 프로젝트는 **Turborepo + PNPM 모노레포** 위에서, **TanStack Router(파일 기반 라우팅)**와 **DDD 스타일의 도메인 모듈**로 기능을 구성하는 관리자 대시보드입니다.

- **앱의 "화면"은 `src/pages`(라우트 파일)**에서 정의
- **비즈니스 기능은 `src/domains`(도메인 모듈)**로 분리
- **공통 UI/레이아웃/유틸은 `packages/shared`**, **API/환경설정은 `packages/core`**로 분리

---

## 모노레포 구조

```text
admin/
├── apps/
│   ├── my-app/            # 메인 관리자 앱 (Vite)
│   └── storybook/         # UI/컴포넌트 문서 (Storybook)
├── packages/
│   ├── core/              # API 클라이언트, env config
│   ├── shared/            # 공통 UI/레이아웃/스토어/유틸
│   ├── date-picker/       # 날짜 선택 컴포넌트
│   └── editor/            # 에디터 래퍼
└── docs/                  # 프로젝트 공통 가이드
```

---

## `my-app` 구조(핵심)

### 엔트리 포인트

`apps/my-app/src/main.tsx`에서 다음을 수행합니다.

- `setupApiClient()`로 **API 인증 연동 초기화**
- `QueryClientProvider`로 **TanStack Query 구성**
- `RouterProvider`로 **TanStack Router 구성**
- `ThemeProvider`로 **테마/스타일 컨텍스트 구성**

### 라우팅(TanStack Router: 파일 기반)

- 라우트 소스: `apps/my-app/src/pages`
- 라우트 트리 생성 설정: `apps/my-app/tsr.config.json`
- 생성 파일: `apps/my-app/src/routeTree.gen.ts`

#### 라우트 레이아웃 그룹

- `src/pages/__root.tsx`
  - 앱 최상위 루트
  - 전역 `ErrorBoundary` 적용
  - 전역 로딩 오버레이(React Query `useIsFetching`) 적용
  - `VITE_FEATURE_DEBUG=true`일 때 Router Devtools를 **동적 임포트**

- `src/pages/_public.tsx` + `src/pages/_public/*`
  - **인증이 필요 없는** 페이지 레이아웃
  - 예) `src/pages/_public/login.tsx`

- `src/pages/_authenticated.tsx` + `src/pages/_authenticated/*`
  - **인증이 필요한** 페이지 레이아웃
  - `beforeLoad`에서 `useAuthStore.getState()`로 인증 여부 확인 후 미인증이면 `/login`으로 redirect

> 라우트 인증 상세는 `apps/my-app/docs/ROUTE_AUTH_GUIDE.md`를 참고합니다.

---

## 도메인 구조(DDD 스타일)

도메인은 `apps/my-app/src/domains/<domain>`에 위치하며, **UI/상태/서비스/API 호출을 도메인 단위로 묶어** 유지보수 범위를 줄입니다.

현재 도메인(예시):

- `auth/`: 로그인/로그아웃, 토큰/인증 상태
- `dashboard/`: 대시보드 위젯/표/데이터 모델
- `settlement/`: 정산 리스트/폼/테이블, 스키마(zod)
- `template/`: 템플릿/샘플(예: `template/my-food`)

### 표준 폴더 규칙(권장)

도메인마다 아래 구조를 기본으로 가져갑니다.

- `components/`: 화면 조립용 UI 컴포넌트
- `hooks/`: 도메인 전용 훅(서버 상태/로컬 상태/조합)
- `services/`: API 호출/비즈니스 유틸(가능한 순수 함수 지향)
- `stores/`: Zustand 스토어(인증 등 전역 상태)
- `types/`: 도메인 타입

도메인 특성에 따라 추가로 아래 폴더를 둘 수 있습니다.

- `schemas/`: zod 스키마(폼/요청 검증)
- `columns/`: 테이블 컬럼 정의
- `data/`: 목업 데이터(개발/스토리/테스트 목적)

### 페이지는 "얇게", 도메인은 "두껍게"

- `src/pages`는 **라우트/레이아웃/권한/서치 파라미터** 등 라우팅 관심사에 집중
- 실제 기능 구현(상태/비즈니스 로직/데이터 호출)은 `src/domains`로 이동

---

## 공통 패키지 사용 원칙

### `@repo/shared`

- 공통 UI: `@repo/shared/components/ui`
- 공통 레이아웃: `@repo/shared/components/layouts`
- 공통 컨텍스트: `@repo/shared/components/context`
- 전역 스타일: `@repo/shared/globals.css`

> 경로 별 alias/resolve 설정은 `docs/ALIAS_GUIDE.md`를 참고합니다.

### `@repo/core`

- 환경 변수/런타임 설정: `@repo/core/config`
- Axios 기반 API 클라이언트 + 인증 훅킹: `@repo/core/api`

`my-app`은 `setupApiClient()`에서 `configureAuth()`를 통해 아래를 연결합니다.

- 인증 상태 저장소: `useAuthStore`
- 토큰 갱신 함수: `postAuthRefreshToken`
- 인증 실패 시 처리: 스토어 초기화 + `/login` 이동

---

## 확장 가이드(실제 적용 흐름)

### 새로운 도메인 추가

1. `src/domains/<new-domain>/` 생성
2. `components/`, `hooks/`, `services/`, `types/`부터 시작
3. 도메인 진입점(`index.ts`)에서 외부 공개 API만 export
4. 라우트(`src/pages`)에서는 도메인의 공개 API만 조합

### 새로운 페이지(라우트) 추가

1. `src/pages` 아래에 파일/폴더 추가
2. 인증 필요 여부에 따라 `_public` 또는 `_authenticated` 하위로 배치
3. 페이지 컴포넌트는 레이아웃/컨테이너 역할로 유지하고, 기능은 도메인으로 이동

---

## 관련 문서

- `docs/ALIAS_GUIDE.md`
- `apps/my-app/docs/ROUTE_AUTH_GUIDE.md`
- `apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md`
- `apps/my-app/docs/BUNDLE_OPTIMIZATION.md`

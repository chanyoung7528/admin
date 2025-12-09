# My Admin App

TanStack Router + Vite 기반 관리자 대시보드 애플리케이션입니다.

## 빠른 시작

```bash
pnpm install
pnpm --filter apps/my-app dev
pnpm --filter apps/my-app build
```

필수 환경변수 (`.env.development` 등):

```env
VITE_API_BASE_URL=https://api.example.com
```

## 주요 폴더

```
src/
├── domains/              # 비즈니스 도메인
│   ├── auth/             # 로그인/토큰 스토어, 폼
│   ├── dashboard/        # 대시보드 위젯
│   ├── settlement/       # 정산 테이블/폼/서비스
│   └── template/         # 데모/샘플 템플릿
├── pages/                # TanStack Router 파일 기반 라우트
│   ├── __root.tsx        # 루트 레이아웃 + ErrorBoundary
│   ├── _authenticated/   # 인증 레이아웃/하위 라우트
│   └── _public/          # 비인증 라우트
├── setupApiClient.ts     # API 초기화
└── main.tsx              # 엔트리
```

## 사용 가이드

- UI: `@repo/shared`의 컴포넌트/레이아웃을 사용 (`import '@repo/shared/globals.css'` 필수).
- 테이블: `@repo/shared/components/data-table` + 도메인별 `useXxxTable` 패턴.
- 에러 처리: 루트·레이아웃·섹션별 `ErrorBoundary` 적용. 상세: `docs/ERROR_BOUNDARY_IMPLEMENTATION.md`.
- 인증: `domains/auth`가 로그인, 토큰 스토어, `setupApiClient`에서 `configureAuth` 호출.
- 배포: `docs/DEPLOYMENT.md` 참고.

## 라우팅

- 파일 기반 라우팅(TanStack Router). `_authenticated/*`는 보호 라우트, `_public/*`는 공개 라우트.
- 페이지 내에서 도메인 컴포넌트를 조합해 화면을 구성합니다.

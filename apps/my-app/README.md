# my-app

Vite 기반 관리자 대시보드 앱입니다. (React 19 + TanStack Router + TanStack Query)

## 실행

### 레포 루트에서 실행(권장)

```bash
# 개발
pnpm dev:my-app

# 빌드
pnpm build:my-app
```

### 앱 디렉토리에서 실행

```bash
pnpm dev
pnpm build
pnpm preview
```

## 환경 변수

`@repo/core/config(env)`에서 아래 값을 사용합니다.

- `VITE_API_BASE_URL` (필수)
- `VITE_API_PROXY_PREFIX` (선택, 기본 `/api`)
- `VITE_API_TIMEOUT` (선택, 기본 `30000`)
- `VITE_API_ACCEPT_LANGUAGE` (선택, 기본 `ko-KR`)
- `VITE_FEATURE_DEBUG` (선택, 기본 `false`)

## 주요 폴더

```text
src/
├── domains/   # 도메인 모듈 (auth/dashboard/settlement/...)
└── pages/     # TanStack Router 파일 기반 라우트
              # _public / _authenticated 레이아웃 그룹
```

## 문서

- [라우트 인증 가이드](./docs/ROUTE_AUTH_GUIDE.md)
- [배포(Vercel)](./docs/DEPLOYMENT.md)
- [번들 최적화](./docs/BUNDLE_OPTIMIZATION.md)
- [ErrorBoundary 적용](./docs/ERROR_BOUNDARY_IMPLEMENTATION.md)
- [프로젝트 아키텍처(루트)](../../docs/ARCHITECTURE.md)
- [Alias 가이드(루트)](../../docs/ALIAS_GUIDE.md)

# Admin Dashboard

TanStack Router 기반의 DDD 구조 관리자 대시보드

## 📋 프로젝트 구조

```
admin/
├── apps/                    # 애플리케이션
│   ├── my-app/             # 메인 관리자 앱
│   └── storybook/          # UI 컴포넌트 문서
├── packages/               # 공유 패키지
│   ├── core/               # API 클라이언트, 환경 설정
│   ├── shared/             # 공통 UI 컴포넌트
│   ├── date-picker/        # 날짜 선택 컴포넌트
│   └── editor/             # CKEditor 래퍼
└── docs/                   # 프로젝트 문서
```

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 메인 앱
pnpm dev:my-app

# Storybook
pnpm dev:storybook
```

### 빌드

```bash
# 전체 빌드
pnpm build

# 특정 앱만 빌드
pnpm build:my-app
pnpm build:storybook
```

## 🛠️ 기술 스택

- **Framework**: React 19 + Vite
- **Router**: TanStack Router
- **State**: TanStack Query + Zustand
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI (Shadcn)
- **Monorepo**: Turborepo + PNPM
- **Language**: TypeScript

## 📚 문서

### 프로젝트 가이드

- [아키텍처](./docs/ARCHITECTURE.md) - Domain-Driven Design 구조 설명
- [Alias 가이드](./docs/ALIAS_GUIDE.md) - 경로 alias 설정 방법
- [PNPM Catalogs](./docs/PNPM_CATALOGS.md) - 의존성 관리 방법

### 앱별 가이드

#### my-app

- [번들 최적화](./apps/my-app/docs/BUNDLE_OPTIMIZATION.md)
- [배포 가이드](./apps/my-app/docs/DEPLOYMENT.md)
- [ErrorBoundary](./apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md)
- [라우트 인증](./apps/my-app/docs/ROUTE_AUTH_GUIDE.md)

#### storybook

- [README](./apps/storybook/README.md)

### 패키지 가이드

#### @repo/core

- [API 인증 통합](./packages/core/docs/API_AUTH_INTEGRATION.md)

#### @repo/shared

- [DataTable 가이드](./packages/shared/docs/data-table/README.md)
- [DataTable 아키텍처](./packages/shared/docs/data-table/ARCHITECTURE.md)
- [Form 컴포넌트](./packages/shared/docs/form/README.md)

#### @repo/date-picker

- [README](./packages/date-picker/README.md)

#### @repo/editor

- [README](./packages/editor/README.md)

## 📄 라이센스

MIT

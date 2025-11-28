# 🏗️ Admin Monorepo

DDD 기반 관리자 대시보드를 중심으로 한 Turborepo입니다. `apps`, `packages` 전체가 pnpm workspace로 묶여 있으며 React 19 + TanStack Router + Shadcn UI 조합을 사용합니다.

## 📦 폴더 구성

| 경로                   | 설명                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `apps/my-app`          | 실제 관리자 웹앱. TanStack Router + React Query + Zustand 조합 |
| `apps/storybook`       | shared UI 문서화 전용 Storybook                                |
| `packages/shared`      | Shadcn 기반 UI, DataTable, Toolkit                             |
| `packages/core`        | axios 클라이언트, 인증 설정, env 스키마                        |
| `packages/date-picker` | dayjs 연동 DatePicker/DateRangePicker                          |
| `packages/editor`      | CKEditor 5 커스텀 래퍼                                         |

각 디렉터리별 README는 간단한 사용법만 다루고, 세부 내용은 `/docs` 에 정리합니다.

## ⚙️ 빠른 시작

```bash
pnpm install               # 루트 의존성 설치
pnpm dev:my-app            # my-app 개발 서버
pnpm dev:storybook         # Storybook 개발 서버
pnpm build:my-app          # my-app 프로덕션 빌드
pnpm build:storybook       # Storybook 정적 빌드
pnpm lint && pnpm type-check
```

> CI 스크립트는 `package.json` 의 turbo 파이프라인을 그대로 사용합니다.

## 📚 문서 모음

| 문서                                | 내용                                            |
| ----------------------------------- | ----------------------------------------------- |
| `docs/APP_ARCHITECTURE.md`          | 실제 도메인/라우트 구조, URL 상태 설계          |
| `docs/APP_DEPLOYMENT.md`            | Vercel 설정, `.vercelignore`, 빌드 파이프라인   |
| `docs/ALIAS_GUIDE.md`               | 각 앱/패키지별 TS/Vite alias 규칙               |
| `docs/API_AUTH_INTEGRATION.md`      | `configureAuth`, `setupApiClient`, refresh flow |
| `docs/DATA_TABLE_IMPLEMENTATION.md` | Settlement DataTable 구성과 재사용 패턴         |
| `docs/DATA_TABLE_PAGINATION.md`     | manual pagination, UI 상태, 디버깅 가이드       |
| `docs/ERROR_BOUNDARY.md`            | ErrorBoundary 계층 구조와 사용 지침             |
| `docs/FAKER_SETUP.md`               | Faker 기반 Mock 데이터 전략                     |
| `docs/ROUTE_AUTH_GUIDE.md`          | TanStack Router 레이아웃, `beforeLoad` 인증     |
| `docs/STORYBOOK_SETUP.md`           | Storybook 구조, CustomDocsPage                  |
| `docs/BUNDLE_ANALYSIS.md`           | 최신 번들 사이즈, 최적화 전략                   |

필요한 가이드를 먼저 정독한 뒤 모듈을 수정하는 것이 원칙입니다.

## ✨ 주요 특징

- **DDD + Composition**: `apps/my-app/src/domains` 단위로 컴포넌트/훅/서비스 구성.
- **공용 DataTable**: `packages/shared` 의 `useDataTableController` + URL 동기화.
- **Auth Core**: `packages/core/api` 의 `configureAuth` 로 토큰 주입/갱신 중앙화.
- **문서화 우선**: 모든 핵심 작업은 `/docs` 에 근거를 남기고 README 는 요약만 유지.

## 🧪 스크립트 요약

| 명령                                     | 설명                      |
| ---------------------------------------- | ------------------------- |
| `pnpm dev`                               | 전체 앱 워치              |
| `pnpm dev:my-app` / `pnpm dev:storybook` | 단일 앱 개발 서버         |
| `pnpm build`                             | 터보 빌드 (CI 동일)       |
| `pnpm lint`, `pnpm lint:fix`             | eslint 전역 실행          |
| `pnpm type-check`                        | tsconfig 기반 타입 검사   |
| `pnpm clean`                             | Turbo & node_modules 정리 |

## 🔗 연관 패키지

- `@repo/shared` 의 Shadcn UI는 my-app과 Storybook이 동일 alias로 불러옵니다.
- `@repo/core` 는 axios 인스턴스/토큰 재발급 로직을 제공하며 앱에서는 `setupApiClient()` 한 번만 호출하면 됩니다.
- `@repo/date-picker`, `@repo/editor` 는 Storybook과 앱에서 모두 사용 가능합니다.

필수 가이드는 `/docs` 를 참고하고, 중복 문서나 오래된 경로가 보이면 바로 정리해 주세요. README 는 앞으로도 “요약 & 링크” 역할에 집중합니다.

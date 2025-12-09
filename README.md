# 🏗️ Admin Monorepo

Turborepo 기반 React/Vite 관리자 대시보드 모노레포입니다. 도메인 주도 설계(DDD) 패턴을 적용하여 확장 가능한 구조로 설계되었습니다.

## 📦 워크스페이스 구조

### Apps

- `apps/my-app` - 메인 대시보드 애플리케이션
- `apps/storybook` - UI 컴포넌트 문서 (Storybook)

### Packages

- `@repo/core` - API 클라이언트, 인증, 환경변수 관리
- `@repo/shared` - 공통 UI 컴포넌트, 레이아웃, DataTable, Form
- `@repo/date-picker` - DatePicker/DateRangePicker 컴포넌트
- `@repo/editor` - CKEditor 5 React 래퍼
- `@repo/eslint-config` - ESLint + Prettier 설정
- `@repo/typescript-config` - TypeScript 공통 설정

## 🚀 빠른 시작

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev:my-app        # 대시보드 (http://localhost:3000)
pnpm dev:storybook     # 스토리북 (http://localhost:6006)

# 빌드
pnpm build:my-app      # 대시보드 빌드
pnpm build:storybook   # 스토리북 빌드
pnpm build             # 전체 빌드

# 코드 품질
pnpm lint              # 린트 검사
pnpm lint:fix          # 린트 자동 수정
pnpm format            # 코드 포맷팅
pnpm type-check        # 타입 체크
```

## 📚 주요 가이드 문서

### 시작하기

- [빠른 시작 가이드](docs/QUICK_START.md) - 5분 안에 시작하기 ⭐
- [패키지 사용 가이드](docs/PACKAGES_GUIDE.md) - 패키지별 빠른 사용법
- [도메인 구조 및 개발 패턴](docs/DOMAIN_STRUCTURE.md) - 도메인 설계 패턴

### 앱별 가이드

- [My App 가이드](apps/my-app/README.md) - 대시보드 앱 구조 및 실행
- [Storybook 가이드](apps/storybook/README.md) - UI 문서화

### 개발 패턴

- [API 통합 가이드](docs/API_INTEGRATION.md) - API 클라이언트 사용법
- [상태 관리 가이드](docs/STATE_MANAGEMENT.md) - Zustand, TanStack Query 패턴
- [라우팅 가이드](docs/ROUTING_GUIDE.md) - 파일 기반 라우팅, 인증 처리
- [테이블 개발 가이드](docs/TABLE_GUIDE.md) - DataTable 컨트롤러 패턴
- [폼 개발 가이드](docs/FORM_GUIDE.md) - React Hook Form + Zod 패턴
- [에러 처리 가이드](apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md) - ErrorBoundary 적용

### 패키지별 가이드

- [Core 패키지](packages/core/README.md) - API 클라이언트, 인증
- [Shared 패키지](packages/shared/README.md) - 공통 UI 컴포넌트
  - [DataTable 가이드](packages/shared/src/components/data-table/README.md)
  - [Form 가이드](packages/shared/src/components/form/README.md)
- [Date Picker 패키지](packages/date-picker/README.md)
- [Editor 패키지](packages/editor/README.md)

### 배포

- [My App 배포 가이드](apps/my-app/docs/DEPLOYMENT.md) - Vercel 배포

## 🔧 기술 스택

### 코어 기술

- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구 (React Compiler, 코드 스플리팅 최적화)
- **TypeScript** - 타입 안전성
- **Tailwind CSS v4** - 스타일링

### 상태 관리

- **TanStack Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리 (인증)

### 라우팅 & 폼

- **TanStack Router** - 파일 기반 타입 세이프 라우팅
- **React Hook Form + Zod** - 폼 관리 및 검증

### 데이터 테이블

- **TanStack Table** - 테이블 상태 관리
- **URL 동기화** - 페이지네이션, 필터, 검색 상태

### 모노레포 & 코드 품질

- **Turborepo** - 모노레포 빌드 최적화
- **pnpm** - 패키지 매니저
- **ESLint + Prettier** - 코드 품질 및 포맷팅
- **Husky + lint-staged** - Git hooks

## 🎯 아키텍처 특징

### 도메인 주도 설계 (DDD)

```
src/domains/
├── auth/          # 인증 도메인
├── dashboard/     # 대시보드 도메인
├── settlement/    # 정산 도메인
└── template/      # 템플릿 도메인

각 도메인 구조:
├── components/    # UI 컴포넌트
├── hooks/         # 커스텀 훅
├── services/      # API 서비스
├── stores/        # 상태 관리
├── types/         # 타입 정의
└── schemas/       # Zod 스키마
```

### 컨트롤러 패턴

- **DataTable 컨트롤러**: 테이블 상태를 훅으로 관리하여 재사용성 향상
- **Form 컨트롤러**: React Hook Form + Zod로 일관된 폼 처리

### 계층적 에러 처리

- 루트 레벨: 전체 앱 보호
- 레이아웃 레벨: 헤더/본문 분리
- 페이지/섹션 레벨: 세부 영역 보호

## 🛠️ 개발 명령어

```bash
# 앱별 실행
pnpm --filter my-app dev           # 대시보드
pnpm --filter storybook-docs dev   # 스토리북

# 전체 실행
pnpm dev                           # 모든 앱 동시 실행

# 빌드 명령어
pnpm build:my-app                  # 프로덕션 빌드
pnpm build:my-app:dev              # 프로덕션.dev 빌드

# 유틸리티
pnpm clean                         # 캐시 및 의존성 제거
pnpm clean:cache                   # Turbo 캐시만 제거
pnpm gf                           # 삭제된 원격 브랜치 정리
```

## 📖 코딩 가이드

### 새 도메인 추가

1. `src/domains/[domain-name]` 폴더 생성
2. 필요한 하위 폴더 구성 (components, hooks, services, types 등)
3. `index.ts`로 공개 API 정의

### 새 페이지 추가

1. `src/pages` 폴더에 파일 생성 (TanStack Router 자동 감지)
2. 인증 필요 시 `_authenticated/` 하위에 생성
3. 공개 페이지는 `_public/` 하위에 생성

### 새 공통 컴포넌트 추가

1. `packages/shared/src/components/ui`에 생성
2. `index.ts`에서 export
3. Storybook 스토리 작성 (`apps/storybook/src/stories`)

## 🔗 참고 링크

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Turborepo](https://turbo.build/repo)

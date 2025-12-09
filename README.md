# 🏗️ Admin Monorepo

Turborepo 기반 React/Vite 관리자 대시보드 모노레포입니다. 앱과 패키지별 사용법은 가이드 링크를 통해 확인합니다.

## 📦 워크스페이스

- Apps: `apps/my-app`(대시보드), `apps/storybook`(UI 문서)
- Packages: `@repo/core`, `@repo/shared`, `@repo/date-picker`, `@repo/editor`, `@repo/eslint-config`, `@repo/typescript-config`

## 🚀 빠른 실행

```bash
pnpm install
pnpm --filter apps/my-app dev       # 대시보드
pnpm --filter apps/storybook dev    # 스토리북
```

## 🧭 사용 가이드

- 패키지/앱 개요: `docs/PACKAGES_GUIDE.md`
- 대시보드 실행/구조: `apps/my-app/README.md`
- 배포: `apps/my-app/docs/DEPLOYMENT.md`, `apps/storybook/README.md`
- 공용 UI: `packages/shared/README.md` (DataTable/Form 포함)
- 인프라/빌드: `@repo/core`, `@repo/eslint-config`, `@repo/typescript-config` 각 README
- 날짜/에디터 컴포넌트: `packages/date-picker/README.md`, `packages/editor/README.md`

## 🔧 기술 스택

- React 19, Vite, TanStack Router/Query, Tailwind CSS v4
- Monorepo: Turborepo + pnpm
- 코드 품질: `@repo/eslint-config`, `@repo/typescript-config`

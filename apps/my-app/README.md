# My Admin App

TanStack Router + React Query 기반 관리자 웹앱. 이 README는 요약만 제공하며, 세부 구조는 루트 `/docs` 를 참고하세요.

## ⚙️ 스크립트

```bash
pnpm dev:my-app      # 개발 서버
pnpm build:my-app    # 프로덕션 빌드
pnpm lint --filter my-app...
pnpm type-check --filter my-app...
```

## 📁 주요 디렉터리

| 경로                           | 설명                                            |
| ------------------------------ | ----------------------------------------------- |
| `src/domains/*`                | DDD 규칙으로 구성된 비즈니스 컴포넌트/훅/서비스 |
| `src/pages/_authenticated.tsx` | 인증 레이아웃 + beforeLoad                      |
| `src/pages/_authenticated/*`   | 실제 페이지(라우트 트리)                        |
| `src/pages/_public/*`          | 로그인 등 공개 페이지                           |
| `src/setupApiClient.ts`        | axios + refresh token 초기화                    |

세부 설계는 `docs/APP_ARCHITECTURE.md` 와 `docs/DATA_TABLE_IMPLEMENTATION.md` 를 먼저 확인하세요.

## 🔗 필수 문서

- `docs/APP_ARCHITECTURE.md` : 도메인/라우트 구조
- `docs/API_AUTH_INTEGRATION.md` : 인증 및 axios 설정
- `docs/ROUTE_AUTH_GUIDE.md` : TanStack Router 인증 패턴
- `docs/DATA_TABLE_PAGINATION.md` : Settlement DataTable과 URL 상태
- `docs/APP_DEPLOYMENT.md` : Vercel 빌드/배포

## 🧱 기술 스택

- React 19 + Vite
- TanStack Router / React Query
- Zustand (auth store)
- Tailwind v4 + @repo/shared UI

## 📌 참고

- `.env` 에 `VITE_API_BASE_URL`, `VITE_FEATURE_DEBUG` 등을 정의하면 `packages/core/config/env.ts` 가 검증합니다.
- Faker 기반 Mock 데이터는 `docs/FAKER_SETUP.md` 를 참고하여 실제 API로 쉽게 교체할 수 있습니다.

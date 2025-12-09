## 패키지 사용 가이드

필요한 사용법만 빠르게 확인할 수 있는 요약본입니다. 상세 내용은 각 README로 이동하세요.

### 공통 실행

- 의존성: `pnpm install`
- 대시보드(dev): `pnpm --filter apps/my-app dev`
- 스토리북(dev): `pnpm --filter apps/storybook dev`

### 앱

- `apps/my-app`: Vite 대시보드. `.env`에 `VITE_API_BASE_URL` 필수. 실행/구조: `apps/my-app/README.md`
- `apps/storybook`: shared UI 문서. 사용법: `apps/storybook/README.md`

### @repo/core

- 역할: Axios API 클라이언트, 토큰 리프레시, env 파싱
- env: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_API_ACCEPT_LANGUAGE`, `VITE_FEATURE_DEBUG`
- 사용:

```ts
import { api, configureAuth } from '@repo/core/api';
configureAuth({ store: authStore, refreshTokens: refreshFn, onAuthFailure: () => router.navigate({ to: '/login' }) });
const res = await api.get('/users');
```

- 더보기: `packages/core/README.md`

### @repo/shared

- 역할: 공통 UI, 레이아웃, DataTable, Form, ErrorBoundary, 훅/유틸
- 필수: `import '@repo/shared/globals.css';`
- 예시: `import { Button } from '@repo/shared/components/ui';`
- DataTable/폼/에러 사용법: `packages/shared/README.md`, `packages/shared/src/components/data-table/README.md`, `packages/shared/src/components/form/README.md`

### @repo/date-picker

- 역할: dayjs 기반 DatePicker/DateRangePicker
- 필수: `import '@repo/date-picker/styles.css';`
- 예시: `import { DateRangePicker } from '@repo/date-picker';`
- 더보기: `packages/date-picker/README.md`

### @repo/editor

- 역할: CKEditor5 커스텀 빌드 React 래퍼
- 특징: 설치 시 postinstall 자동 빌드, 필요 시 `pnpm --filter @repo/editor build`
- 더보기: `packages/editor/README.md`

### @repo/eslint-config

- React/Vite:

```js
import { reactConfig } from '@repo/eslint-config';
export default reactConfig;
```

- 라이브러리/Node: `import { baseConfig } from '@repo/eslint-config/base';`
- 더보기: `packages/eslint-config/README.md`

### @repo/typescript-config

- Vite 앱:

```json
{ "extends": "@repo/typescript-config/vite", "include": ["src"] }
```

- 라이브러리: `extends: "@repo/typescript-config/react"`
- 더보기: `packages/typescript-config/README.md`

### 참고 링크

- TanStack Router: https://tanstack.com/router/latest
- TanStack Query: https://tanstack.com/query/latest
- React Hook Form: https://react-hook-form.com/
- react-error-boundary: https://github.com/bvaughn/react-error-boundary

# 패키지 사용 가이드

필요한 사용법만 빠르게 확인할 수 있는 요약본입니다. 상세 내용은 각 패키지 README를 참고하세요.

## 빠른 시작

### 공통 실행

```bash
pnpm install                        # 의존성 설치
pnpm dev:my-app                    # 대시보드 개발 서버
pnpm dev:storybook                 # 스토리북 개발 서버
pnpm build:my-app                  # 대시보드 빌드
pnpm lint                          # 린트 검사
pnpm format                        # 코드 포맷팅
```

## Apps

### apps/my-app

메인 대시보드 애플리케이션

**필수 환경변수** (`.env.development`, `.env.production` 등)

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_API_ACCEPT_LANGUAGE=ko-KR
VITE_FEATURE_DEBUG=false
```

**실행**

```bash
pnpm --filter my-app dev           # 개발 서버 (http://localhost:3000)
pnpm --filter my-app build         # 프로덕션 빌드
pnpm --filter my-app build:dev     # 프로덕션.dev 빌드
```

**상세 가이드**: `apps/my-app/README.md`

### apps/storybook

공통 UI 컴포넌트 문서화 (Storybook)

**실행**

```bash
pnpm --filter storybook-docs dev   # 개발 서버 (http://localhost:6006)
pnpm --filter storybook-docs build # 정적 사이트 생성
```

**상세 가이드**: `apps/storybook/README.md`

## @repo/core

API 클라이언트, 인증 토큰 관리, 환경변수 파싱을 담당하는 인프라 패키지

### 주요 기능

- Axios 기반 API 클라이언트 (인터셉터 포함)
- 401 에러 시 자동 토큰 갱신
- 환경변수 검증 및 기본값 제공
- 5xx/네트워크 에러 핸들링

### 환경변수

```env
VITE_API_BASE_URL=https://api.example.com    # 필수
VITE_API_TIMEOUT=30000                       # 기본값: 30000
VITE_API_ACCEPT_LANGUAGE=ko-KR               # 기본값: ko-KR
VITE_FEATURE_DEBUG=false                     # 기본값: false
VITE_API_PROXY_PREFIX=/api                   # 개발 프록시 경로
```

### 사용법

**1. API 클라이언트 초기화** (앱 시작 시 한 번)

```ts
import { configureAuth } from '@repo/core/api';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';
import { postAuthRefreshToken } from '@/domains/auth/services/authService';

configureAuth({
  store: useAuthStore, // accessToken/refreshToken 제공
  refreshTokens: postAuthRefreshToken, // 토큰 갱신 함수
  onAuthFailure: () => {
    useAuthStore.getState().clearAuth();
    window.location.href = '/login';
  },
  onError: error => {
    if (error.message === 'NETWORK_ERROR') {
      alert('네트워크 연결을 확인해주세요.');
    }
  },
});
```

**2. API 호출**

```ts
import { api } from '@repo/core/api';

// GET 요청
const users = await api.get('/users');

// POST 요청
const newUser = await api.post('/users', { name: 'John' });

// 토큰 없이 요청 (공개 API)
const publicData = await api.get('/public', { skipAuth: true });
```

**3. 환경변수 사용**

```ts
import { env } from '@repo/core/config';

console.log(env.apiBaseUrl); // VITE_API_BASE_URL
console.log(env.isDebug); // VITE_FEATURE_DEBUG
```

### 에러 처리

- `AuthError`: 인증 실패 (REFRESH_FAILED, UNAUTHORIZED)
- 자동 리다이렉트: 토큰 갱신 실패 시 `onAuthFailure` 호출

**상세 가이드**: `packages/core/README.md`, `docs/API_INTEGRATION.md`

## @repo/shared

공통 UI 컴포넌트, 레이아웃, DataTable, Form, ErrorBoundary 등을 제공하는 패키지

### 주요 기능

- **UI 컴포넌트**: Button, Input, Select, Table, Dialog 등 (Radix UI 기반)
- **레이아웃**: Header, Sidebar, Layout, PageContainer 등
- **DataTable**: TanStack Table 기반 고급 테이블 (페이지네이션, 필터, 정렬, URL 동기화)
- **Form**: React Hook Form 통합 컴포넌트
- **ErrorBoundary**: 계층적 에러 처리
- **훅/유틸**: useDialogState, useIsMobile 등

### 설치 및 설정

**필수**: 앱 진입점에서 전역 스타일 임포트

```ts
import '@repo/shared/globals.css';
```

### 사용법

**UI 컴포넌트**

```tsx
import { Button, Input, Dialog } from '@repo/shared/components/ui';

<Button variant="default" size="md">확인</Button>
<Input placeholder="이름을 입력하세요" />
```

**레이아웃**

```tsx
import { Layout, Header } from '@repo/shared/components/layouts';

<Layout onSignOut={handleSignOut}>
  <Header links={navLinks} onSignOut={handleSignOut} />
  {children}
</Layout>;
```

**DataTable** - 컨트롤러 패턴 (추천)

```tsx
import { DataTable, useDataTableController } from '@repo/shared/components/data-table';

const controller = useDataTableController({
  tableId: 'users',
  columns: userColumns,
  useQueryHook: useUsers,
  queryParams: ({ pagination, columnFilters, globalFilter }) => ({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status: columnFilters.find(f => f.id === 'status')?.value,
    search: globalFilter,
  }),
  filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
});

<DataTable {...controller.tableProps} />;
```

**Form 컴포넌트**

```tsx
import { FormTable, FormInput, FormFieldError } from '@repo/shared/components/form';
import { useForm } from 'react-hook-form';

const {
  control,
  formState: { errors },
} = useForm();

<FormTable title="기본 정보">
  <FormTable.Row>
    <FormTable.Cell label="이름" required>
      <FormInput name="name" control={control} />
      <FormFieldError message={errors.name?.message} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>;
```

**ErrorBoundary**

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

<ErrorBoundary fallback="default" showHomeButton onError={console.error}>
  <App />
</ErrorBoundary>;
```

**상세 가이드**

- 전체: `packages/shared/README.md`
- DataTable: `packages/shared/src/components/data-table/README.md`, `docs/TABLE_GUIDE.md`
- Form: `packages/shared/src/components/form/README.md`, `docs/FORM_GUIDE.md`
- ErrorBoundary: `apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md`

## @repo/date-picker

dayjs 기반 DatePicker/DateRangePicker 컴포넌트

### 설치 및 설정

```tsx
import { DatePicker, DateRangePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css'; // 필수
```

### 사용법

**단일 날짜 선택**

```tsx
<DatePicker defaultDate="2025-01-01" timeFormat="yyyy-MM-dd 23:59:59" onChangePickerDate={date => console.log(date)} placeholderText="날짜 선택" width="full" />
```

**날짜 범위 선택**

```tsx
<DateRangePicker
  defaultDate={{ startDate: '', endDate: '' }}
  onChangePickerDate={({ startDate, endDate, displayStartDate, displayEndDate }) => {
    console.log('서버용:', startDate, endDate);
    console.log('표시용:', displayStartDate, displayEndDate);
  }}
  width={240}
  isEditMode={false}
/>
```

**Props**

- `defaultDate`: 초기 값
- `onChangePickerDate`: 변경 콜백 (필수)
- `width`: 너비 (number | 'default' | 'full')
- `disabled`: 비활성화 여부
- `timeFormat`: 시간 포맷 (DatePicker)
- `isEditMode`: true면 시간을 00:00:00으로 고정 (DateRangePicker)

**상세 가이드**: `packages/date-picker/README.md`

## @repo/editor

CKEditor 5 커스텀 빌드 React 래퍼

### 특징

- postinstall 시 자동 빌드 (별도 빌드 불필요)
- 수동 빌드: `pnpm --filter @repo/editor build`
- CKEditor 번들은 git에 미포함

### 사용법

```tsx
import { useState } from 'react';
import { CKEditor } from '@repo/editor';

export function EditorExample() {
  const [content, setContent] = useState('');

  return <CKEditor data={content} onEditorChange={setContent} placeholder="내용을 입력하세요..." />;
}
```

**상세 가이드**: `packages/editor/README.md`

## @repo/eslint-config

ESLint + Prettier 통합 설정 (Flat Config)

### 포함 내용

- ESLint Recommended + TypeScript ESLint
- Prettier 연동
- simple-import-sort (자동 import 정렬)
- React Hooks + React Refresh (reactConfig)

### 사용법

**React/Vite 앱**

```js
// eslint.config.js
import { reactConfig } from '@repo/eslint-config';

export default reactConfig;
```

**라이브러리/Node 프로젝트**

```js
import { baseConfig } from '@repo/eslint-config/base';

export default baseConfig;
```

**Prettier만 사용**

```js
import prettierConfig from '@repo/eslint-config/prettier';

export default prettierConfig;
```

**상세 가이드**: `packages/eslint-config/README.md`

## @repo/typescript-config

공통 TypeScript 설정 (base → react → vite 계층)

### 사용법

**Vite 기반 앱**

```json
{
  "extends": "@repo/typescript-config/vite",
  "include": ["src"]
}
```

**React 라이브러리**

```json
{
  "extends": "@repo/typescript-config/react",
  "include": ["src"]
}
```

**일반 라이브러리**

```json
{
  "extends": "@repo/typescript-config/base",
  "include": ["src"]
}
```

### 주요 설정

- `strict: true` - 엄격한 타입 체크
- `noUnusedLocals/Parameters: true` - 미사용 변수 감지
- `declaration: true` - 타입 선언 파일 생성
- `jsx: react-jsx` (react, vite)
- `types: ["vite/client", "node"]` (vite)

**상세 가이드**: `packages/typescript-config/README.md`

## 통합 개발 패턴

### DataTable 컨트롤러 패턴

도메인별 `useXxxTable` 훅을 만들어 테이블 로직 캡슐화

```tsx
// domains/settlement/hooks/useSettlementTable.ts
export function useSettlementTable({ service }) {
  return useDataTableController({
    tableId: `settlement-${service}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: columnFilters.find(f => f.id === 'status')?.value,
    }),
  });
}

// 컴포넌트에서 사용
const { tableProps } = useSettlementTable({ service: 'BODY' });
<DataTable {...tableProps} />;
```

### API 서비스 패턴

도메인별 서비스 함수 정의

```tsx
// domains/settlement/services/settlementService.ts
import { api } from '@repo/core/api';

export async function getSettlements(params) {
  const { data } = await api.get('/settlements', { params });
  return data;
}

// domains/settlement/hooks/useSettlements.ts
import { useQuery } from '@tanstack/react-query';

export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
  });
}
```

### Form + Zod 패턴

스키마 정의 후 React Hook Form과 통합

```tsx
// domains/settlement/schemas/settlementSchema.ts
import { z } from 'zod';

export const settlementSchema = z.object({
  site: z.string().min(1, '사이트를 입력하세요'),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
});

// 컴포넌트에서 사용
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(settlementSchema),
});
```

### 상태 관리 패턴

- **서버 상태**: TanStack Query (useQuery, useMutation)
- **클라이언트 상태**: Zustand (인증, 전역 UI 상태)

```tsx
// domains/auth/stores/useAuthStore.ts
export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      setTokens: tokens => set(tokens),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

## 참고 링크

### 공식 문서

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Turborepo](https://turbo.build/repo)

### 추가 리소스

- [react-error-boundary](https://github.com/bvaughn/react-error-boundary)
- [dayjs](https://day.js.org/)
- [CKEditor 5](https://ckeditor.com/ckeditor-5/)

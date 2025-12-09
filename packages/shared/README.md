## @repo/shared

재사용 가능한 UI/레이아웃/데이터 테이블/폼 컴포넌트와 공용 훅·유틸을 모은 패키지입니다. 프로젝트 전역에서 동일한 UI/동작을 유지할 때 사용합니다.

### 설치/준비

- 워크스페이스 의존성 설치 후 사용합니다.
- 전역 스타일을 한 번만 포함하세요.

```ts
import '@repo/shared/globals.css';
```

### 주요 사용법

- UI 컴포넌트: `import { Button, Input } from '@repo/shared/components/ui';`
- 레이아웃: `import { Layout } from '@repo/shared/components/layouts';`
- 에러 바운더리: `import { ErrorBoundary } from '@repo/shared/components/ui';`
- 훅: `import { useDialogState } from '@repo/shared/hooks/useDialogState';`

### DataTable

- 서버/클라이언트 페이지네이션, 필터, 검색을 지원하는 테이블.
- 컨트롤러 패턴 추천:

```tsx
import { DataTable, useDataTableController } from '@repo/shared/components/data-table';

const controller = useDataTableController({
  tableId: 'settlement',
  columns,
  useQueryHook: useSettlements,
});

<DataTable {...controller.tableProps} />;
```

- 더보기: `packages/shared/src/components/data-table/README.md` (TanStack Table/Query 기반)

### Form 컴포넌트

- React Hook Form 기반 FormTable/FormInput/FormError 제공.
- 예시:

```tsx
import { FormTable, FormFieldError, FormInput } from '@repo/shared/components/form';

<FormTable title="기본 정보">
  <FormTable.Row>
    <FormTable.Cell label="이름" required>
      <FormInput name="name" control={control} />
      <FormFieldError message={errors.name?.message} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>;
```

- 더보기: `packages/shared/src/components/form/README.md`

### 에러 바운더리

- 폴백 스타일: `default | simple | minimal`
- 적용 예시:

```tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

<ErrorBoundary fallback="default" onError={log}>
  <App />
</ErrorBoundary>;
```

- 적용 사례: `apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md`, 추가 개념: https://github.com/bvaughn/react-error-boundary

### 스타일 토큰

- 테마/글로벌 토큰은 `@repo/shared/styles/theme.css`에 정의되어 있습니다. 필요 시 override 하세요.

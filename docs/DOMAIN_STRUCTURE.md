# 도메인 구조 및 개발 패턴 가이드

도메인 주도 설계(DDD)를 적용한 프로젝트 구조와 개발 패턴을 설명합니다.

## 핵심 개념

**도메인별 독립**: 비즈니스 도메인별로 코드를 구조화하여 응집도를 높이고 의존성을 낮춥니다.

**폴더 구조**: components, hooks, services, stores, schemas, types 등으로 구성

**관련 문서**: 각 가이드에서 구체적인 패턴 확인 ([API](API_INTEGRATION.md), [테이블](TABLE_GUIDE.md), [폼](FORM_GUIDE.md))

## 도메인 구조

```
src/domains/
├── auth/          # 인증 도메인
│   ├── components/    # LoginForm
│   ├── hooks/         # useLogin, useLogout
│   ├── services/      # authService (API)
│   ├── stores/        # useAuthStore (Zustand)
│   └── types/         # AuthUser, AuthTokens
├── dashboard/     # 대시보드 도메인
├── settlement/    # 정산 도메인
│   ├── components/    # SettlementTable, SettlementForm
│   ├── hooks/         # useSettlements, useSettlementTable
│   ├── services/      # settlementService (API)
│   ├── schemas/       # settlementSchema (Zod)
│   ├── types/         # Settlement
│   └── columns/       # settlementColumns (TanStack Table)
└── template/      # 템플릿 도메인
```

## 폴더별 역할

| 폴더          | 역할                      | 예시                               |
| ------------- | ------------------------- | ---------------------------------- |
| `components/` | UI 컴포넌트               | SettlementTable, SettlementForm    |
| `hooks/`      | 커스텀 훅                 | useSettlements, useSettlementTable |
| `services/`   | API 호출                  | getSettlements, createSettlement   |
| `stores/`     | 클라이언트 상태 (Zustand) | useAuthStore                       |
| `schemas/`    | Zod 검증                  | settlementSchema                   |
| `types/`      | 타입 정의                 | Settlement, GetSettlementsParams   |
| `columns/`    | 테이블 컬럼               | settlementColumns                  |

## 개발 패턴

### API 통합 패턴 (서비스 → 훅 → 컴포넌트)

```tsx
// 1. 서비스 (services/settlementService.ts)
export async function getSettlements(params) {
  const { data } = await api.get('/settlements', { params });
  return data;
}

// 2. 훅 (hooks/useSettlements.ts)
export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
  });
}

// 3. 컴포넌트 (components/SettlementTable.tsx)
export function SettlementTable() {
  const { data } = useSettlements({ page: 1, pageSize: 10 });
  return <DataTable data={data} columns={settlementColumns} />;
}
```

### 테이블 컨트롤러 패턴

```tsx
// hooks/useSettlementTable.ts
export function useSettlementTable() {
  return useDataTableController({
    tableId: 'settlement',
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    }),
  });
}

// components/SettlementTable.tsx
export function SettlementTable() {
  const { tableProps } = useSettlementTable();
  return <DataTable {...tableProps} />;
}
```

### 폼 패턴 (React Hook Form + Zod)

```tsx
// schemas/settlementSchema.ts
export const settlementSchema = z.object({
  site: z.string().min(1),
  amount: z.number().min(0),
});

// components/SettlementForm.tsx
export function SettlementForm({ onSubmit }) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(settlementSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput name="site" control={control} />
      <FormInput name="amount" control={control} type="number" />
      <button type="submit">저장</button>
    </form>
  );
}
```

### 상태 관리 패턴

```tsx
// 서버 상태 (TanStack Query)
const { data } = useQuery({
  queryKey: ['settlements'],
  queryFn: getSettlements,
});

// 클라이언트 상태 (Zustand)
const { accessToken } = useAuthStore();
```

## 새 도메인 추가하기

### 1단계: 폴더 생성

```bash
mkdir -p src/domains/new-domain/{components,hooks,services,types}
```

### 2단계: 기본 파일

```tsx
// types/types.ts
export interface NewDomain {
  id: number;
  name: string;
}

// services/newDomainService.ts
export async function getNewDomains() {
  const { data } = await api.get('/new-domains');
  return data;
}

// hooks/useNewDomains.ts
export function useNewDomains() {
  return useQuery({
    queryKey: ['newDomains'],
    queryFn: getNewDomains,
  });
}

// components/NewDomainView.tsx
export function NewDomainView() {
  const { data } = useNewDomains();
  return <div>{/* UI */}</div>;
}

// index.ts (공개 API)
export * from './components';
export * from './hooks';
export * from './types';
```

### 3단계: 페이지에서 사용

```tsx
// pages/_authenticated/new-domain/index.tsx
import { NewDomainView } from '@/domains/new-domain';

export const Route = createFileRoute('/_authenticated/new-domain')({
  component: () => <NewDomainView />,
});
```

## 체크리스트

**필수**

- ✅ 도메인별로 독립적인 폴더 구조
- ✅ index.ts로 공개 API만 노출
- ✅ 서비스 → 훅 → 컴포넌트 패턴
- ✅ 타입 먼저 정의 후 구현

**권장**

- ✅ 공통 로직은 `@repo/shared`로 분리
- ✅ 컴포넌트는 작고 단순하게
- ✅ 도메인 간 직접 import 지양

## 관련 가이드

- [API 통합](API_INTEGRATION.md) - 서비스/훅 패턴
- [테이블 개발](TABLE_GUIDE.md) - 컨트롤러 패턴
- [폼 개발](FORM_GUIDE.md) - RHF + Zod 패턴
- [라우팅](ROUTING_GUIDE.md) - 페이지와 도메인 연결

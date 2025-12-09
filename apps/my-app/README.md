# My Admin App

도메인 주도 설계(DDD)를 적용한 TanStack Router + Vite 기반 관리자 대시보드 애플리케이션입니다.

## 빠른 시작

```bash
# 의존성 설치 (루트에서)
pnpm install

# 개발 서버 실행
pnpm --filter my-app dev           # http://localhost:3000

# 빌드
pnpm --filter my-app build         # 프로덕션 빌드
pnpm --filter my-app build:dev     # 프로덕션.dev 빌드

# 기타
pnpm --filter my-app lint          # 린트 검사
pnpm --filter my-app type-check    # 타입 체크
pnpm --filter my-app preview       # 빌드 미리보기
```

## 환경변수

**필수 환경변수** (`.env.development`, `.env.production` 등)

```env
VITE_API_BASE_URL=https://api.example.com       # API 서버 주소 (필수)
VITE_API_TIMEOUT=30000                          # API 타임아웃 (기본: 30000)
VITE_API_ACCEPT_LANGUAGE=ko-KR                  # Accept-Language 헤더 (기본: ko-KR)
VITE_FEATURE_DEBUG=false                        # 디버그 모드 (기본: false)
VITE_API_PROXY_PREFIX=/api                      # 개발 프록시 경로 (선택)
```

## 프로젝트 구조

```
apps/my-app/
├── src/
│   ├── domains/              # 도메인 주도 설계 (DDD)
│   │   ├── auth/             # 인증 도메인
│   │   │   ├── components/   # LoginForm 등
│   │   │   ├── hooks/        # useLogin, useLogout
│   │   │   ├── services/     # authService (API 호출)
│   │   │   ├── stores/       # useAuthStore (Zustand)
│   │   │   └── types/        # 타입 정의
│   │   ├── dashboard/        # 대시보드 도메인
│   │   │   ├── components/   # DashboardView, 위젯들
│   │   │   ├── data/         # mockData
│   │   │   └── types/        # 타입 정의
│   │   ├── settlement/       # 정산 도메인
│   │   │   ├── columns/      # 테이블 컬럼 정의
│   │   │   ├── components/   # SettlementTable, SettlementForm 등
│   │   │   ├── hooks/        # useSettlementTable, useSettlements
│   │   │   ├── schemas/      # Zod 스키마
│   │   │   ├── services/     # settlementService (API 호출)
│   │   │   └── types/        # 타입 정의
│   │   └── template/         # 템플릿 도메인 (데모용)
│   ├── pages/                # TanStack Router 파일 기반 라우팅
│   │   ├── __root.tsx        # 루트 레이아웃 + ErrorBoundary
│   │   ├── _authenticated.tsx # 인증 레이아웃 (beforeLoad로 인증 체크)
│   │   ├── _authenticated/   # 보호된 페이지들
│   │   │   ├── index.tsx     # 대시보드 (//)
│   │   │   └── settlement/   # 정산 페이지들
│   │   ├── _public.tsx       # 공개 레이아웃
│   │   └── _public/
│   │       └── login.tsx     # 로그인 페이지
│   ├── main.tsx              # 앱 진입점 (QueryClient, Router 설정)
│   ├── setupApiClient.ts     # API 클라이언트 초기화
│   └── index.css             # 전역 스타일
├── docs/
│   ├── DEPLOYMENT.md         # Vercel 배포 가이드
│   └── ERROR_BOUNDARY_IMPLEMENTATION.md  # 에러 처리 가이드
├── vite.config.ts            # Vite 설정 (alias, 코드 스플리팅 등)
├── tsconfig.json             # TypeScript 설정
└── package.json              # 의존성 및 스크립트
```

## 도메인 구조 패턴

각 도메인은 다음과 같은 구조를 따릅니다:

```
domains/[domain-name]/
├── components/        # UI 컴포넌트
├── hooks/             # 커스텀 훅 (useXxxTable, useXxx 등)
├── services/          # API 서비스 (xxxService.ts)
├── stores/            # 상태 관리 (Zustand)
├── schemas/           # Zod 검증 스키마
├── types/             # 타입 정의
├── columns/           # 테이블 컬럼 정의 (TanStack Table)
└── index.ts           # 공개 API (exports)
```

**상세 가이드**: `../../docs/DOMAIN_STRUCTURE.md`

## 주요 개발 패턴

### 1. API 통합 패턴

**서비스 레이어** (`services/`)

```tsx
import { api } from '@repo/core/api';

export async function getSettlements(params: GetSettlementsParams) {
  const { data } = await api.get('/settlements', { params });
  return data;
}
```

**커스텀 훅** (`hooks/`)

```tsx
import { useQuery } from '@tanstack/react-query';

export function useSettlements(params: GetSettlementsParams) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
  });
}
```

**상세 가이드**: `../../docs/API_INTEGRATION.md`

### 2. DataTable 컨트롤러 패턴

```tsx
// hooks/useSettlementTable.ts
export function useSettlementTable({ service }) {
  return useDataTableController({
    tableId: `settlement-${service}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: columnFilters.find(f => f.id === 'status')?.value,
      filter: globalFilter,
    }),
  });
}

// components/SettlementTable.tsx
const { tableProps } = useSettlementTable({ service: 'BODY' });
<DataTable {...tableProps} />;
```

**상세 가이드**: `../../docs/TABLE_GUIDE.md`

### 3. Form + Zod 패턴

```tsx
// schemas/settlementSchema.ts
export const settlementSchema = z.object({
  site: z.string().min(1, '사이트를 입력하세요'),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
});

// components/SettlementForm.tsx
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(settlementSchema),
});

<FormTable title="기본 정보">
  <FormTable.Row>
    <FormTable.Cell label="사이트" required>
      <FormInput name="site" control={control} />
      <FormFieldError message={errors.site?.message} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>;
```

**상세 가이드**: `../../docs/FORM_GUIDE.md`

### 4. 상태 관리 패턴

- **서버 상태**: TanStack Query (캐싱, 동기화)
- **클라이언트 상태**: Zustand (인증, 전역 UI 상태)

```tsx
// stores/useAuthStore.ts
export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      setTokens: tokens => set(tokens),
      clearAuth: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => localStorage) }
  )
);
```

**상세 가이드**: `../../docs/STATE_MANAGEMENT.md`

### 5. 라우팅 패턴

**파일 기반 라우팅** (TanStack Router)

- `pages/_authenticated/` - 인증 필요 페이지
- `pages/_public/` - 공개 페이지

**인증 체크** (`_authenticated.tsx`)

```tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
});
```

**상세 가이드**: `../../docs/ROUTING_GUIDE.md`

## 핵심 기능

### API 클라이언트

- Axios 기반, 자동 토큰 주입
- 401 에러 시 자동 토큰 갱신
- 네트워크/서버 에러 핸들링

### ErrorBoundary

- 루트 레벨: 전체 앱 보호
- 레이아웃 레벨: Header/Content 분리
- 페이지/섹션 레벨: 세부 영역 보호

**상세 가이드**: `docs/ERROR_BOUNDARY_IMPLEMENTATION.md`

### 번들 최적화

- 코드 스플리팅: vendor, 도메인별 청크 분리
- Tree shaking: 미사용 코드 제거
- Dynamic import: DevTools는 개발 모드에만 로드
- React Compiler: 자동 최적화

## 배포

Vercel 배포 가이드: `docs/DEPLOYMENT.md`

## 관련 가이드

- [루트 README](../../README.md) - 전체 프로젝트 개요
- [패키지 가이드](../../docs/PACKAGES_GUIDE.md) - 패키지별 사용법
- [도메인 구조](../../docs/DOMAIN_STRUCTURE.md) - 도메인 설계 패턴
- [API 통합](../../docs/API_INTEGRATION.md) - API 클라이언트
- [상태 관리](../../docs/STATE_MANAGEMENT.md) - Query, Zustand
- [라우팅](../../docs/ROUTING_GUIDE.md) - 파일 기반 라우팅
- [테이블 개발](../../docs/TABLE_GUIDE.md) - DataTable 패턴
- [폼 개발](../../docs/FORM_GUIDE.md) - RHF + Zod 패턴

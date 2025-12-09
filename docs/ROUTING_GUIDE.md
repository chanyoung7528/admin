# 라우팅 가이드

TanStack Router로 파일 기반 타입 세이프 라우팅을 구현하는 방법을 설명합니다.

## 핵심 개념

**파일 기반**: 파일 구조 = URL 구조

**타입 안전**: 라우트, 파라미터, 검색 쿼리 모두 타입 체크

**관련 문서**: [TanStack Router](https://tanstack.com/router/latest)

## 프로젝트 구조

```
src/pages/
├── __root.tsx                # 루트 레이아웃
├── _authenticated.tsx        # 인증 레이아웃
├── _authenticated/
│   ├── index.tsx             # / (대시보드)
│   └── settlement/
│       ├── list.tsx          # /settlement/list
│       └── $id.tsx           # /settlement/:id
├── _public.tsx               # 공개 레이아웃
└── _public/
    └── login.tsx             # /login
```

## 기본 라우트

### 루트 레이아웃

```tsx
// pages/__root.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export const Route = createRootRouteWithContext()({
  component: () => (
    <ErrorBoundary fallback="default" showHomeButton>
      <Outlet />
    </ErrorBoundary>
  ),
});
```

### 인증 레이아웃

```tsx
// pages/_authenticated.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  // 인증 체크
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: () => (
    <Layout>
      <Header />
      <Outlet />
    </Layout>
  ),
});
```

### 페이지

```tsx
// pages/_authenticated/settlement/list.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settlement/list')({
  component: SettlementListPage,
});

function SettlementListPage() {
  return <div>정산 목록</div>;
}
```

## 파라미터

### URL 파라미터

```tsx
// pages/_authenticated/settlement/$id.tsx
export const Route = createFileRoute('/_authenticated/settlement/$id')({
  component: () => {
    const { id } = Route.useParams(); // 타입 안전!
    return <div>ID: {id}</div>;
  },
});
```

### 검색 파라미터

```tsx
import { z } from 'zod';

// 스키마 정의
const searchSchema = z.object({
  page: z.number().optional().default(1),
  status: z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_authenticated/settlement/list')({
  validateSearch: search => searchSchema.parse(search),
  component: () => {
    const search = Route.useSearch(); // 타입 안전!
    return <div>Page: {search.page}</div>;
  },
});
```

## 데이터 로딩

### loader

```tsx
export const Route = createFileRoute('/_authenticated/settlement/$id')({
  loader: ({ context, params }) => {
    // 페이지 진입 전 데이터 로드
    return context.queryClient.ensureQueryData({
      queryKey: ['settlement', params.id],
      queryFn: () => getSettlement(params.id),
    });
  },
  pendingComponent: () => <div>로딩 중...</div>,
  component: SettlementDetailPage,
});
```

## 네비게이션

### Link 컴포넌트

```tsx
import { Link } from '@tanstack/react-router';

// 기본
<Link to="/settlement/list">목록</Link>

// 파라미터
<Link to="/settlement/$id" params={{ id: '123' }}>상세</Link>

// 검색 파라미터
<Link to="/settlement/list" search={{ page: 2 }}>2페이지</Link>

// Active 스타일
<Link
  to="/settlement/list"
  activeProps={{ className: 'font-bold text-blue-600' }}
>
  목록
</Link>
```

### useNavigate 훅

```tsx
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();

// 기본
navigate({ to: '/settlement/list' });

// 파라미터
navigate({ to: '/settlement/$id', params: { id: '123' } });

// 검색 파라미터 업데이트
navigate({
  search: prev => ({ ...prev, page: prev.page + 1 }),
});
```

## 고급 기능

### beforeLoad (접근 제어)

```tsx
export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();

    if (!user?.isAdmin) {
      throw redirect({ to: '/' });
    }
  },
});
```

### errorComponent

```tsx
export const Route = createFileRoute('/_authenticated/settlement/$id')({
  loader: ({ params }) => getSettlement(params.id),
  errorComponent: ({ error }) => <div>에러: {error.message}</div>,
});
```

### notFoundComponent

```tsx
export const Route = createRootRoute({
  notFoundComponent: () => (
    <div>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <Link to="/">홈으로</Link>
    </div>
  ),
});
```

## URL 매칭 규칙

| 파일 경로             | URL 경로            |
| --------------------- | ------------------- |
| `index.tsx`           | `/`                 |
| `about.tsx`           | `/about`            |
| `settlement/list.tsx` | `/settlement/list`  |
| `settlement/$id.tsx`  | `/settlement/:id`   |
| `_authenticated.tsx`  | 레이아웃 (URL 없음) |

## 체크리스트

**필수**

- ✅ \_\_root.tsx에 ErrorBoundary
- ✅ \_authenticated.tsx에 beforeLoad
- ✅ 검색 파라미터는 validateSearch로 검증

**권장**

- ✅ loader로 데이터 미리 로드
- ✅ pendingComponent로 로딩 표시
- ✅ Link의 activeProps로 활성 상태 표시

## 관련 가이드

- [도메인 구조](DOMAIN_STRUCTURE.md) - 페이지와 도메인 연결
- [API 통합](API_INTEGRATION.md) - loader에서 데이터 로드
- [TanStack Router](https://tanstack.com/router/latest) - 공식 문서

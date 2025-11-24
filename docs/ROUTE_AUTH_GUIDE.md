# 🔐 인증 기반 라우트 구조 가이드

TanStack Router를 사용한 인증/퍼블릭 라우트 분기 처리

## 📁 새로운 라우트 구조

```
apps/my-app/src/pages/
├── __root.tsx                    # 루트 레이아웃
├── _authenticated.tsx            # 인증 필요 레이아웃 (사이드바 포함)
├── _public.tsx                   # 퍼블릭 레이아웃 (사이드바 없음)
│
├── _authenticated/               # 인증 필요한 페이지들
│   ├── index.tsx                 # → / (메인 대시보드)
│   ├── user/
│   │   ├── list.tsx              # → /user/list
│   │   ├── register.tsx          # → /user/register
│   │   └── ...
│   ├── my-mind/
│   │   ├── dashboard.tsx         # → /my-mind/dashboard
│   │   └── ...
│   └── ...
│
└── _public/                      # 퍼블릭 페이지들
    ├── login.tsx                 # → /login
    ├── about.tsx                 # → /about
    └── test.tsx                  # → /test
```

## 🎯 핵심 개념

### 1. 레이아웃 라우트 (`_` prefix)

TanStack Router에서 `_` prefix가 붙은 파일은 **레이아웃 라우트**입니다:

- URL에 포함되지 않음
- 자식 라우트에 공통 레이아웃 제공
- 인증 체크 등 공통 로직 처리

### 2. `_authenticated.tsx` - 인증 레이아웃

```typescript
import { Layout } from '@repo/shared/components/layouts';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  // ✅ 모든 자식 라우트에서 실행됨
  beforeLoad: async ({ location }) => {
    const isAuthenticated = checkAuth();

    if (!isAuthenticated) {
      // 로그인 페이지로 리다이렉트
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href, // 로그인 후 돌아갈 URL
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <Layout>  {/* 사이드바 포함 */}
      <Outlet />  {/* 자식 라우트 렌더링 */}
    </Layout>
  );
}
```

### 3. `_public.tsx` - 퍼블릭 레이아웃

```typescript
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />  {/* 사이드바 없음 */}
    </div>
  );
}
```

## 📝 페이지 작성 방법

### ✅ 인증 필요 페이지

```typescript
// apps/my-app/src/pages/_authenticated/user/list.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/user/list')({
  component: UserListPage,
});

function UserListPage() {
  // ✅ Layout은 _authenticated.tsx에서 제공
  // ✅ 사이드바 자동 포함
  // ✅ 인증 자동 체크
  return (
    <div>
      <h1>사용자 목록</h1>
      {/* 컨텐츠만 작성 */}
    </div>
  );
}
```

### ✅ 퍼블릭 페이지

```typescript
// apps/my-app/src/pages/_public/login.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  // ✅ 사이드바 없음
  // ✅ 인증 체크 없음
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form>{/* 로그인 폼 */}</form>
    </div>
  );
}
```

## 🔄 기존 페이지 마이그레이션

### Before (기존 방식)

```typescript
// ❌ pages/user/list.tsx
function UserListPage() {
  return (
    <Layout>  {/* 매번 Layout 감싸야 함 */}
      <div>사용자 목록</div>
    </Layout>
  );
}
```

### After (새 방식)

```typescript
// ✅ pages/_authenticated/user/list.tsx
export const Route = createFileRoute('/_authenticated/user/list')({
  component: UserListPage,
});

function UserListPage() {
  // Layout 자동 적용!
  return <div>사용자 목록</div>;
}
```

## 🛠️ 마이그레이션 단계

### 1. 기존 페이지 파일 확인

```bash
# 현재 위치
pages/
├── index.tsx              # 대시보드
├── user/list.tsx          # 사용자 목록
└── login.tsx              # 로그인
```

### 2. 인증 여부에 따라 분류

**인증 필요 (대부분):**

- `/` (대시보드)
- `/user/*`
- `/my-mind/*`
- `/my-food/*`
- `/my-body/*`
- `/monitoring/*`
- `/report/*`
- `/inquiry/*`

**퍼블릭:**

- `/login`
- `/about`
- `/test` (테스트용)

### 3. 파일 이동 및 경로 업데이트

#### Step 1: 인증 필요 페이지 이동

```bash
# 예시: user/list.tsx 이동
mv pages/user/list.tsx pages/_authenticated/user/list.tsx
```

#### Step 2: 파일 내용 업데이트

```typescript
// Before
export const Route = createFileRoute('/user/list')({
  component: UserListPage,
});

function UserListPage() {
  return (
    <Layout>  {/* 제거 */}
      <div>컨텐츠</div>
    </Layout>
  );
}

// After
export const Route = createFileRoute('/_authenticated/user/list')({
  //                                  ^^^^^^^^^^^^^^^ 추가
  component: UserListPage,
});

function UserListPage() {
  // Layout 제거!
  return <div>컨텐츠</div>;
}
```

#### Step 3: 퍼블릭 페이지 이동

```bash
mv pages/login.tsx pages/_public/login.tsx
```

```typescript
// login.tsx 업데이트
export const Route = createFileRoute('/_public/login')({
  //                                  ^^^^^^^^^ 추가
  component: LoginPage,
});
```

## 🔐 인증 로직 구현

### 1. Auth Store 생성 (Zustand)

```typescript
// apps/my-app/src/domains/auth/stores/useAuthStore.ts
import { create } from 'zustand';

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  accessToken: '',
  refreshToken: '',
  setUser: user =>
    set(state => ({
      ...state,
      user,
    })),
  setTokens: tokens =>
    set(state => ({
      ...state,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })),
  reset: () =>
    set({
      user: null,
      accessToken: '',
      refreshToken: '',
    }),
}));
```

### 2. `_authenticated.tsx`에서 사용

```typescript
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;

    if (!useAuthStore.getState().accessToken) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});
```

### 3. 로그인 페이지에서 사용

```typescript
// pages/_public/login.tsx
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useNavigate, useSearch } from '@tanstack/react-router';

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_public/login' });
  const { setTokens } = useAuth();

  const handleLogin = async (credentials: LoginPayload) => {
    const { accessToken, refreshToken } = await loginAPI(credentials);

    await setTokens({ accessToken, refreshToken });

    navigate({ to: search.redirect || '/' });
  };

  return <form onSubmit={handleLogin}>{/* ... */}</form>;
}
```

## 🎨 레이아웃 커스터마이징

### 다양한 레이아웃 추가 가능

```
pages/
├── _authenticated.tsx           # 기본 사이드바 레이아웃
├── _authenticated-minimal.tsx   # 최소화 레이아웃
├── _public.tsx                  # 퍼블릭 레이아웃
└── _public-landing.tsx          # 랜딩 페이지 레이아웃
```

## ✅ 체크리스트

### 마이그레이션 완료 확인

- [ ] `_authenticated.tsx` 생성 완료
- [ ] `_public.tsx` 생성 완료
- [ ] 모든 인증 필요 페이지가 `_authenticated/` 폴더로 이동
- [ ] 모든 퍼블릭 페이지가 `_public/` 폴더로 이동
- [ ] 각 페이지의 `createFileRoute` 경로 업데이트
- [ ] 페이지에서 불필요한 `<Layout>` 제거
- [ ] 인증 로직 구현 (`beforeLoad`)
- [ ] 로그인/로그아웃 기능 테스트
- [ ] 리다이렉트 기능 테스트

### 테스트 시나리오

1. **인증되지 않은 상태**
   - `/` 접근 → `/login`으로 리다이렉트
   - `/user/list` 접근 → `/login`으로 리다이렉트

2. **로그인 후**
   - `/login`에서 로그인 → `/`로 이동
   - 사이드바가 모든 페이지에 표시됨

3. **퍼블릭 페이지**
   - `/login` 접근 → 정상 접근
   - `/about` 접근 → 정상 접근
   - 사이드바가 표시되지 않음

## 📖 참고 자료

- [TanStack Router - Layout Routes](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees#layout-routes)
- [TanStack Router - Authentication](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [TanStack Router - Redirect](https://tanstack.com/router/latest/docs/framework/react/api/redirect)

---

_마지막 업데이트: 2025-11-13_

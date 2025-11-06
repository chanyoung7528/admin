# 프로젝트 구조 상세 가이드

## 📁 폴더 구조

```
src/
├── domains/          # 🧠 비즈니스 로직 및 기능별 컴포넌트
│   │
│   ├── user/         # 사용자 관리 도메인
│   │   ├── components/ # UserListTable, UserInsightChart, UserForm, MessageForm
│   │   ├── hooks/      # useUsersQuery, useUserInsight, useSendMessage
│   │   └── services/   # getUserList, postNewUser, postPushMessage
│   │
│   ├── site/         # Site(B2B 고객사) 관리 도메인
│   │   ├── components/ # SiteSelector, SiteInfo
│   │   └── hooks/      # useSitesQuery
│   │
│   ├── billing/      # 💳 결제/정산 도메인 (공통)
│   │   ├── components/ # SettlementTable, OperationReport, InvoiceGenerator
│   │   ├── hooks/      # useSettlementQuery, useReport
│   │   └── services/   # getB2BSettlement, getOperationReport
│   │
│   ├── inquiry/      # 🗣️ 1:1 문의 도메인 (공통)
│   │   ├── components/ # InquiryList, InquiryReplyForm
│   │   └── hooks/      # useInquiriesQuery
│   │
│   ├── monitoring/   # 🖥️ 모니터링 도메인 (공통)
│   │   ├── components/ # DeviceStatusDashboard, ErrorLogViewer
│   │   └── hooks/      # useDeviceStatus
│   │
│   ├── productBody/  # MY BODY 서비스 도메인
│   │   ├── components/ # BodyUsageDashboard, BodyUsageChart
│   │   └── hooks/      # useBodyUsageQuery
│   │
│   ├── productFood/  # MY FOOD 서비스 도메인
│   │   ├── components/ # FoodOrderList, FoodStockTable, FoodUsageDashboard
│   │   ├── hooks/      # useFoodOrdersQuery, useFoodUsage
│   │   └── services/   # getFoodOrders, getFoodUsageHistory
│   │
│   └── productMind/  # MY MIND 서비스 도메인
│       ├── components/ # ContentUsageList, ContentContractInfo, MindUsageDashboard
│       └── hooks/      # useMindContentQuery, useMindUsage
│
├── shared/           # 📦 공통 모듈 (재사용 UI, 유틸)
│   ├── components/   # Button, Input, Modal, Table, Chart, Layout
│   ├── hooks/        # useModal, useDebounce, usePermission
│   ├── utils/        # formatDate, formatCurrency
│   └── types/        # CommonApiResponse, Pagination
│
├── core/             # ⚙️ 핵심 인프라
│   ├── api/          # axios 인스턴스, API 클라이언트, 인터셉터
│   ├── auth/         # 인증 컨텍스트(Context), 로그인/로그아웃 로직, HOC
│   ├── router/       # 라우트 설정(routes.tsx), PrivateRoute
│   └── stores/       # 전역 상태 관리 (Zustand)
│
└── pages/            # 📄 실제 페이지 (메뉴 구조와 일치, TanStack Router)
    │
    ├── __root.tsx              # 루트 레이아웃
    ├── index.tsx               # 🏠 메인 대시보드
    ├── login.tsx               # 🔐 로그인 페이지
    │
    ├── user/                   # 🧑‍💼 사용자 관리
    │   ├── list.tsx              # 사용자 현황 (/user/list)
    │   └── message.tsx           # 메시지 발송 (/user/message)
    │
    ├── inquiry/                # ❓ 1:1 문의/요청 관리
    │   └── index.tsx             # 문의 목록 (/inquiry)
    │
    ├── monitoring/             # 📊 이용 현황 (공통)
    │   └── index.tsx             # 기기 작동 현황 (/monitoring)
    │
    ├── report/                 # 📈 리포트 (결제/정산)
    │   └── index.tsx             # Site별 운영 현황 (/report)
    │
    ├── my-body/                # 💪 MY BODY
    │   ├── dashboard.tsx         # 이용 현황 Dashboard (/my-body/dashboard)
    │   └── settlement.tsx        # 정산 관리 (/my-body/settlement)
    │
    ├── my-food/                # 🥗 MY FOOD
    │   ├── order.tsx             # 발주 관리 (/my-food/order)
    │   ├── invoice.tsx           # 계산서 출력 (/my-food/invoice)
    │   ├── dashboard.tsx         # 이용 현황 Dashboard (/my-food/dashboard)
    │   └── settlement.tsx        # B2B 정산 관리 (/my-food/settlement)
    │
    └── my-mind/                # 🧘 MY MIND
        ├── usage.tsx             # 콘텐츠 이용 내역 (/my-mind/usage)
        ├── invoice.tsx           # 계산서 출력 (/my-mind/invoice)
        ├── dashboard.tsx         # 이용 현황 Dashboard (/my-mind/dashboard)
        └── settlement.tsx        # B2B 정산 관리 (/my-mind/settlement)
```

## 🎯 설계 원칙

### 1. 도메인 주도 설계 (Domain-Driven Design)

각 비즈니스 도메인은 독립적인 폴더로 구성됩니다:

```
domains/user/
├── components/   # UI 컴포넌트
├── hooks/        # 상태 관리 및 로직
└── services/     # API 통신
```

**장점:**
- 도메인별로 독립적 개발 가능
- 코드 응집도 향상
- 유지보수 용이

### 2. 관심사의 분리 (Separation of Concerns)

- **domains/**: 비즈니스 로직과 도메인 전용 컴포넌트
- **shared/**: 여러 도메인에서 재사용되는 공통 모듈
- **core/**: 애플리케이션 레벨의 인프라 (API, 인증, 라우팅)
- **pages/**: 라우팅과 페이지 조합 (비즈니스 로직 최소화)

### 3. TanStack Router 파일 기반 라우팅

```typescript
// pages/user/list.tsx → /user/list
export const Route = createFileRoute("/user/list")({
  component: UserListPage,
});
```

**규칙:**
- `index.tsx`: 해당 경로의 기본 페이지 (`/user/index.tsx` → `/user`)
- `$param.tsx`: 동적 파라미터 (`/user/$userId.tsx` → `/user/:userId`)
- `__root.tsx`: 전체 앱의 루트 레이아웃

## 📝 파일 명명 규칙

### 컴포넌트
- **PascalCase**: `UserListTable.tsx`, `SiteSelector.tsx`
- **기본 export 사용**: `export default function UserListTable() {}`

### 훅 (Hooks)
- **camelCase + use 접두사**: `useUsersQuery.ts`, `useSendMessage.ts`
- **named export 사용**: `export function useUsersQuery() {}`

### 서비스
- **camelCase**: `userService.ts`, `foodService.ts`
- **named export 사용**: `export async function getUserList() {}`

### 유틸리티
- **camelCase**: `format.ts`, `validation.ts`
- **named export 사용**: `export function formatDate() {}`

## 🔄 데이터 흐름

### API 호출 흐름

```
Page Component
    ↓ (사용)
Custom Hook (useUsersQuery)
    ↓ (호출)
Service (getUserList)
    ↓ (요청)
API Client (axios)
    ↓ (HTTP)
Backend API
```

### 예시 코드

```typescript
// 1. Service: src/domains/user/services/userService.ts
export async function getUserList() {
  return apiClient.get("/users");
}

// 2. Hook: src/domains/user/hooks/useUsersQuery.ts
export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUserList,
  });
}

// 3. Component: src/domains/user/components/UserListTable.tsx
export default function UserListTable() {
  const { data, isLoading } = useUsersQuery();
  // ...render logic
}

// 4. Page: src/pages/user/list.tsx
function UserListPage() {
  return <UserListTable />;
}
```

## 🛠️ 새로운 기능 추가 가이드

### 1. 새로운 도메인 추가

```bash
# 폴더 구조 생성
mkdir -p src/domains/newDomain/{components,hooks,services}

# index 파일 생성
touch src/domains/newDomain/components/index.ts
touch src/domains/newDomain/hooks/index.ts
touch src/domains/newDomain/services/index.ts
```

### 2. 새로운 페이지 추가

```typescript
// src/pages/newDomain/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/newDomain/")({
  component: NewDomainPage,
});

function NewDomainPage() {
  return <div>New Domain Page</div>;
}
```

### 3. 새로운 API 추가

```typescript
// 1. Service 정의
// src/domains/user/services/userService.ts
export async function getUserById(id: string) {
  return apiClient.get(`/users/${id}`);
}

// 2. Hook 정의
// src/domains/user/hooks/useUserQuery.ts
export function useUserQuery(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
  });
}

// 3. 컴포넌트에서 사용
// src/domains/user/components/UserDetail.tsx
export default function UserDetail({ userId }: { userId: string }) {
  const { data, isLoading } = useUserQuery(userId);
  // ...
}
```

## 🔒 인증 처리

```typescript
// src/core/api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/core/api/client.ts
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 📦 Import Alias 설정

```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@ui": path.resolve(__dirname, "../../packages/shared/src/components/ui"),
    "@lib": path.resolve(__dirname, "../../packages/shared/src/lib"),
    // ...
  },
}
```

**사용 예시:**
```typescript
import { Button } from "@ui/button";
import { formatDate } from "@/shared/utils";
import { useUsersQuery } from "@/domains/user/hooks";
```

## 🎨 스타일링 가이드

- **Tailwind CSS v4** 사용
- **@repo/shared** 패키지의 UI 컴포넌트 활용
- 일관된 spacing: `space-y-6`, `gap-6`
- 반응형 디자인: `md:`, `lg:` breakpoints

```typescript
<div className="space-y-6">
  <div className="rounded-lg border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold">제목</h2>
    <p className="text-muted-foreground">내용</p>
  </div>
</div>
```

## 🧪 테스트 전략 (향후 추가 예정)

- **Unit Tests**: 도메인 로직, 유틸리티 함수
- **Integration Tests**: API 호출, 데이터 흐름
- **E2E Tests**: 주요 사용자 시나리오

## 📚 참고 문서

- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs/)


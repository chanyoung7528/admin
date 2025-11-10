# 🏗️ Admin Dashboard Architecture

## 📋 개요

이 프로젝트는 **Domain-Driven Design (DDD)** 원칙을 따르는 관리자 대시보드입니다.
핵심 원칙: **비즈니스 기능별 도메인 구성 + 재사용 가능한 컴포넌트**

---

## 🎯 핵심 철학

### ✅ DO (올바른 접근)
```
도메인 = 비즈니스 기능 (What을 수행)
- dashboard (대시보드)
- monitoring (모니터링)
- settlement (정산)
- report (리포트)
- order (주문 관리)
- content (콘텐츠 관리)
```

### ❌ DON'T (잘못된 접근)
```
도메인 ≠ 제품/서비스명 (Who를 위한)
- productBody (X)
- productFood (X)
- productMind (X)
```

---

## 📁 전체 구조

```
apps/my-app/src/
├── domains/                   # 🧠 비즈니스 로직 (도메인)
│   ├── dashboard/             # 📊 공통 대시보드
│   ├── monitoring/            # 🖥️ 공통 모니터링
│   ├── settlement/            # 💳 공통 정산
│   ├── report/                # 📈 공통 리포트
│   ├── inquiry/               # 🗣️ 공통 문의 관리
│   ├── user/                  # 👤 사용자 관리 (Management 전용)
│   ├── insight/               # 📊 인사이트 분석 (Management 전용)
│   ├── order/                 # 📦 주문 관리 (FOOD 전용)
│   ├── content/               # 📚 콘텐츠 관리 (MIND 전용)
│   ├── billing/               # 💰 결제 관리
│   └── site/                  # 🏢 Site(고객사) 관리
│
└── pages/                     # 📄 실제 라우트 (TanStack Router)
    ├── index.tsx              # 메인 대시보드
    ├── dashboard.tsx          # 이용 현황
    ├── user/                  # 사용자 관리
    ├── my-body/               # MY BODY 서비스
    ├── my-food/               # MY FOOD 서비스
    └── my-mind/               # MY MIND 서비스
```

---

## 🔥 도메인 상세 구조

### 1️⃣ 공통 도메인 (Core Domains)

모든 서비스(BODY/FOOD/MIND)에서 재사용 가능한 도메인

#### 📊 dashboard - 대시보드
```typescript
src/domains/dashboard/
├── components/
│   ├── DashboardView.tsx       // Props: service: 'BODY' | 'FOOD' | 'MIND' | 'ALL'
│   ├── UsageChart.tsx
│   └── index.ts
├── hooks/
│   ├── useDashboardData.ts     // Params: service
│   └── index.ts
└── services/
    ├── dashboardService.ts     // getServiceStats(service)
    └── index.ts
```

**사용 예시:**
```typescript
// MY BODY 대시보드
<DashboardView service="BODY" />

// MY FOOD 대시보드
<DashboardView service="FOOD" />

// 전체 대시보드
<DashboardView service="ALL" />
```

#### 🖥️ monitoring - 모니터링
```typescript
src/domains/monitoring/
├── components/
│   ├── MonitoringPanel.tsx     // Props: service, refreshInterval
│   ├── DeviceStatusDashboard.tsx
│   ├── ErrorLogViewer.tsx
│   └── index.ts
├── hooks/
│   ├── useDeviceStatus.ts      // Params: service
│   └── index.ts
└── services/
    ├── monitoringService.ts    // getDeviceStatus(service)
    └── index.ts
```

**사용 예시:**
```typescript
// MY BODY 모니터링 (30초마다 갱신)
<MonitoringPanel service="BODY" refreshInterval={30000} />

// MY FOOD 모니터링 (1분마다 갱신)
<MonitoringPanel service="FOOD" refreshInterval={60000} />
```

#### 💳 settlement - 정산
```typescript
src/domains/settlement/
├── components/
│   ├── SettlementTable.tsx     // Props: service
│   └── index.ts
├── hooks/
│   ├── useSettlementData.ts    // Params: service
│   └── index.ts
└── services/
    ├── settlementService.ts    // getSettlement(service)
    └── index.ts
```

**사용 예시:**
```typescript
// MY BODY 정산
<SettlementTable service="BODY" />

// MY FOOD 정산
<SettlementTable service="FOOD" />
```

#### 📈 report - 운영 리포트
```typescript
src/domains/report/
├── components/
│   ├── ReportSection.tsx       // Props: service, period
│   └── index.ts
├── hooks/
│   ├── useReportData.ts        // Params: service, period
│   └── index.ts
└── services/
    ├── reportService.ts        // getOperationReport(service, period)
    └── index.ts
```

**사용 예시:**
```typescript
// MY BODY 월별 리포트
<ReportSection service="BODY" period="monthly" />

// MY FOOD 연간 리포트
<ReportSection service="FOOD" period="yearly" />
```

### 2️⃣ 특화 도메인 (Specialized Domains)

특정 서비스에만 사용되는 도메인

#### 👤 user - 사용자 관리 (Management 전용)
```typescript
src/domains/user/
├── components/
│   ├── UserListTable.tsx
│   ├── UserForm.tsx
│   ├── MessageForm.tsx
│   └── index.ts
├── hooks/
│   ├── useUsersQuery.ts
│   ├── useSendMessage.ts
│   └── index.ts
└── services/
    ├── userService.ts
    └── index.ts
```

#### 📊 insight - 인사이트 분석 (Management 전용)
```typescript
src/domains/insight/
├── components/
│   ├── InsightDashboard.tsx
│   └── index.ts
├── hooks/
│   ├── useInsightData.ts
│   └── index.ts
└── services/
    ├── insightService.ts
    └── index.ts
```

#### 📦 order - 주문 관리 (FOOD 전용)
```typescript
src/domains/order/
├── components/
│   ├── OrderList.tsx
│   └── index.ts
├── hooks/
│   ├── useOrdersData.ts
│   └── index.ts
└── services/
    ├── orderService.ts
    └── index.ts
```

#### 📚 content - 콘텐츠 관리 (MIND 전용)
```typescript
src/domains/content/
├── components/
│   ├── ContentList.tsx
│   └── index.ts
├── hooks/
│   ├── useContentData.ts
│   └── index.ts
└── services/
    ├── contentService.ts
    └── index.ts
```

---

## 🔌 페이지에서 도메인 조합

페이지는 도메인 컴포넌트를 **조립(Composition)**하여 구성합니다.

### 예시 1: MY BODY 대시보드
```typescript
// pages/my-body/dashboard.tsx
import { DashboardView } from "@/domains/dashboard/components";
import { MonitoringPanel } from "@/domains/monitoring/components";

function BodyDashboardPage() {
  return (
    <>
      <DashboardView service="BODY" />
      <MonitoringPanel service="BODY" refreshInterval={30000} />
    </>
  );
}
```

### 예시 2: MY FOOD 정산
```typescript
// pages/my-food/settlement.tsx
import { SettlementTable } from "@/domains/settlement/components";

function FoodSettlementPage() {
  return (
    <>
      <SettlementTable service="FOOD" />
    </>
  );
}
```

### 예시 3: Management 메인
```typescript
// pages/index.tsx
import { InsightDashboard } from "@/domains/insight/components";
import { DashboardView } from "@/domains/dashboard/components";

function MainDashboardPage() {
  return (
    <>
      <InsightDashboard />
      <DashboardView service="ALL" />
    </>
  );
}
```

---

## 📊 페이지-도메인 매핑

### Management
| 페이지 | 사용 도메인 |
|--------|-------------|
| `/` (메인) | `insight`, `dashboard` |
| `/dashboard` | `dashboard` |
| `/user/list` | `user` |
| `/user/insight` | `insight` |
| `/user/register` | `user` |
| `/user/message` | `user` |
| `/inquiry` | `inquiry` |
| `/monitoring` | `monitoring` |

### MY BODY
| 페이지 | 사용 도메인 |
|--------|-------------|
| `/my-body/dashboard` | `dashboard`, `monitoring` |
| `/my-body/monitoring` | `monitoring` |
| `/my-body/settlement` | `settlement` |
| `/my-body/report` | `report` |

### MY FOOD
| 페이지 | 사용 도메인 |
|--------|-------------|
| `/my-food/dashboard` | `dashboard`, `monitoring` |
| `/my-food/monitoring` | `monitoring` |
| `/my-food/order` | `order` |
| `/my-food/delivery` | `order` |
| `/my-food/inquiry` | `inquiry` |
| `/my-food/settlement` | `settlement` |
| `/my-food/report` | `report` |

### MY MIND
| 페이지 | 사용 도메인 |
|--------|-------------|
| `/my-mind/dashboard` | `dashboard`, `monitoring` |
| `/my-mind/monitoring` | `monitoring` |
| `/my-mind/contract` | `content` |
| `/my-mind/inquiry` | `inquiry` |
| `/my-mind/settlement` | `settlement` |
| `/my-mind/report` | `report` |

---

## 💡 DDD 장점

### 1. 재사용성 극대화
```typescript
// ❌ Before (중복 코드)
- productBody/BodyDashboard
- productFood/FoodDashboard
- productMind/MindDashboard

// ✅ After (재사용)
- dashboard/DashboardView (service prop으로 구분)
```

### 2. 유지보수 간편화
```typescript
// 대시보드 수정 시
// ❌ Before: 3개 파일 수정 필요
// ✅ After: 1개 파일만 수정
```

### 3. 확장성
```typescript
// 새 서비스 추가 시
// ❌ Before: 전체 폴더 구조 복제
// ✅ After: service enum에만 추가
type Service = 'BODY' | 'FOOD' | 'MIND' | 'NEW_SERVICE';
```

### 4. 테스트 용이성
```typescript
// 도메인별로 독립적 테스트 가능
describe('DashboardView', () => {
  it('should render BODY dashboard', () => {
    render(<DashboardView service="BODY" />);
  });
});
```

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Routing** | TanStack Router (File-based) |
| **State** | TanStack Query, Zustand |
| **Styling** | Tailwind CSS v4, Shadcn UI |
| **Monorepo** | Turborepo |

---

## 📝 명명 규칙

### 도메인 네이밍
```typescript
✅ 동사/명사 기반 (기능 중심)
- dashboard, monitoring, settlement, report
- order, content, inquiry, user

❌ 제품/서비스명
- productBody, productFood, productMind
```

### 컴포넌트 Props
```typescript
// 서비스 구분이 필요한 경우
interface DashboardViewProps {
  service: 'BODY' | 'FOOD' | 'MIND' | 'ALL';
}

// 기간 옵션이 필요한 경우
interface ReportSectionProps {
  service: 'BODY' | 'FOOD' | 'MIND';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
```

---

## 🚀 추가 확장 가이드

### 새로운 서비스 추가
1. Service 타입에 추가
```typescript
type Service = 'BODY' | 'FOOD' | 'MIND' | 'NEW_SERVICE';
```

2. 페이지 추가
```bash
mkdir -p src/pages/new-service
```

3. 기존 도메인 재사용
```typescript
<DashboardView service="NEW_SERVICE" />
<MonitoringPanel service="NEW_SERVICE" />
```

### 새로운 도메인 추가
1. 도메인 폴더 생성
```bash
mkdir -p src/domains/new-domain/{components,hooks,services}
```

2. 표준 구조 따르기
```typescript
// components/index.ts
export { NewDomainComponent } from './NewDomainComponent';

// hooks/index.ts
export { useNewDomainData } from './useNewDomainData';

// services/index.ts
export * from './newDomainService';
```

---

## 📚 참고 자료

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

## ✨ 요약

이 프로젝트는 **비즈니스 기능 기반 도메인 구조**로 설계되어:
- 🔄 **재사용성 극대화**
- 🧩 **컴포넌트 조립(Composition) 패턴**
- 🚀 **확장 용이성**
- 🛡️ **타입 안전성**

을 제공합니다.


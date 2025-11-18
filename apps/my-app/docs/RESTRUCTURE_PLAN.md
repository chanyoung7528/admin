# 도메인 구조 재설계

## 1. 제거할 잘못된 도메인

```
❌ src/domains/productBody/   → dashboard 도메인으로 통합
❌ src/domains/productFood/   → dashboard + order 도메인으로 분리
❌ src/domains/productMind/   → dashboard + content 도메인으로 분리
```

## 2. 올바른 도메인 구조

### Core Domains (공통 비즈니스 로직)

```
✅ dashboard/          # 📊 대시보드 (모든 서비스 공통)
   ├── components/
   │   ├── DashboardView.tsx       # Props: service: 'BODY' | 'FOOD' | 'MIND' | 'ALL'
   │   ├── UsageChart.tsx          # Props: service, data
   │   ├── StatCard.tsx            # Props: title, value, trend
   │   └── index.ts
   ├── hooks/
   │   ├── useDashboardData.ts     # Params: service
   │   ├── useUsageStats.ts        # Params: service, period
   │   └── index.ts
   └── services/
       ├── dashboardService.ts     # getServiceStats(service)
       └── index.ts

✅ monitoring/         # 🖥️ 모니터링 (BODY/FOOD/MIND 공통)
   ├── components/
   │   ├── MonitoringPanel.tsx     # Props: service, refreshInterval
   │   ├── DeviceStatusCard.tsx    # Props: device
   │   ├── ErrorLogViewer.tsx      # Props: service
   │   └── index.ts
   ├── hooks/
   │   ├── useDeviceStatus.ts      # Params: service
   │   ├── useErrorLogs.ts         # Params: service
   │   └── index.ts
   └── services/
       ├── monitoringService.ts    # getDeviceStatus(service)
       └── index.ts

✅ settlement/         # 💳 정산 (BODY/FOOD/MIND 공통)
   ├── components/
   │   ├── SettlementTable.tsx     # Props: service
   │   ├── InvoiceGenerator.tsx    # Props: service, data
   │   └── index.ts
   ├── hooks/
   │   ├── useSettlement.ts        # Params: service
   │   └── index.ts
   └── services/
       ├── settlementService.ts    # getSettlement(service)
       └── index.ts

✅ report/             # 📈 운영 리포트 (공통)
   ├── components/
   │   ├── ReportSection.tsx       # Props: service, period
   │   ├── ReportChart.tsx         # Props: data, type
   │   └── index.ts
   ├── hooks/
   │   ├── useReport.ts            # Params: service, period
   │   └── index.ts
   └── services/
       ├── reportService.ts        # getOperationReport(service, period)
       └── index.ts

✅ inquiry/            # 🗣️ 1:1 문의 (공통)
   ├── components/
   │   ├── InquiryList.tsx         # Props: category?
   │   ├── InquiryReplyForm.tsx
   │   └── index.ts
   ├── hooks/
   │   ├── useInquiries.ts         # Params: category
   │   └── index.ts
   └── services/
       └── inquiryService.ts
```

### Specialized Domains (특화 기능)

```
✅ user/               # 👤 사용자 관리 (Management 전용)
   ├── components/
   │   ├── UserListTable.tsx
   │   ├── UserForm.tsx
   │   ├── MessageForm.tsx
   │   └── index.ts
   ├── hooks/
   │   ├── useUsers.ts
   │   ├── useSendMessage.ts
   │   └── index.ts
   └── services/
       └── userService.ts

✅ insight/            # 📊 인사이트 분석 (Management 전용)
   ├── components/
   │   ├── InsightDashboard.tsx
   │   ├── UserBehaviorChart.tsx
   │   └── index.ts
   ├── hooks/
   │   └── useInsight.ts
   └── services/
       └── insightService.ts

✅ order/              # 📦 주문/발주 관리 (FOOD 전용)
   ├── components/
   │   ├── OrderList.tsx
   │   ├── StockTable.tsx
   │   └── index.ts
   ├── hooks/
   │   ├── useOrders.ts
   │   ├── useStock.ts
   │   └── index.ts
   └── services/
       └── orderService.ts

✅ content/            # 📚 콘텐츠 관리 (MIND 전용)
   ├── components/
   │   ├── ContentList.tsx
   │   ├── ContractInfo.tsx
   │   └── index.ts
   ├── hooks/
   │   ├── useContent.ts
   │   ├── useContract.ts
   │   └── index.ts
   └── services/
       └── contentService.ts
```

## 3. 페이지에서 도메인 조합 사용 예시

```typescript
// ✅ pages/my-body/dashboard.tsx
import { DashboardView } from "@/domains/dashboard/components";
import { MonitoringPanel } from "@/domains/monitoring/components";

export default function MyBodyDashboardPage() {
  return (
    <>
      <DashboardView service="BODY" />
      <MonitoringPanel service="BODY" refreshInterval={30000} />
    </>
  );
}

// ✅ pages/my-food/dashboard.tsx
import { DashboardView } from "@/domains/dashboard/components";
import { MonitoringPanel } from "@/domains/monitoring/components";

export default function MyFoodDashboardPage() {
  return (
    <>
      <DashboardView service="FOOD" />
      <MonitoringPanel service="FOOD" refreshInterval={30000} />
    </>
  );
}

// ✅ pages/my-body/settlement.tsx
import { SettlementTable } from "@/domains/settlement/components";
import { ReportSection } from "@/domains/report/components";

export default function MyBodySettlementPage() {
  return (
    <>
      <SettlementTable service="BODY" />
      <ReportSection service="BODY" period="monthly" />
    </>
  );
}
```

## 4. 재구조화 단계

### Step 1: 공통 도메인 생성

1. ✅ `dashboard` 도메인 생성 (productBody/Food/Mind의 Dashboard 통합)
2. ✅ `monitoring` 도메인 리팩토링 (service prop 추가)
3. ✅ `settlement` 도메인 생성 (billing에서 분리)
4. ✅ `report` 도메인 생성 (billing에서 분리)

### Step 2: 특화 도메인 정리

1. ✅ `order` 도메인 생성 (productFood에서 주문 관련만 추출)
2. ✅ `content` 도메인 생성 (productMind에서 콘텐츠 관련만 추출)
3. ✅ `insight` 도메인 생성 (user에서 분리)

### Step 3: 잘못된 도메인 제거

1. ❌ `productBody` 삭제
2. ❌ `productFood` 삭제
3. ❌ `productMind` 삭제

### Step 4: 페이지 업데이트

1. 모든 페이지를 새 도메인 구조에 맞게 수정
2. Import 경로 수정
3. Props 전달 방식 수정

## 5. 핵심 원칙

### DDD 관점:

- ✅ 도메인 = 비즈니스 기능 (dashboard, monitoring, settlement)
- ❌ 도메인 ≠ 제품/서비스 (productBody, productFood)

### 재사용성:

- ✅ 하나의 `DashboardView` 컴포넌트가 `service` prop으로 모든 서비스 지원
- ❌ `BodyDashboard`, `FoodDashboard`, `MindDashboard` 중복 생성

### 확장성:

- ✅ 새 서비스 추가 시 `service` enum에만 추가
- ❌ 새 `productXXX` 폴더 전체 생성

## 6. 마이그레이션 체크리스트

- [ ] dashboard 도메인 생성
- [ ] monitoring 도메인 리팩토링
- [ ] settlement 도메인 생성
- [ ] report 도메인 생성
- [ ] order 도메인 생성
- [ ] content 도메인 생성
- [ ] insight 도메인 생성
- [ ] 모든 페이지 import 수정
- [ ] productBody/Food/Mind 삭제
- [ ] ARCHITECTURE.md 업데이트
- [ ] 타입 에러 확인
- [ ] 런타임 테스트

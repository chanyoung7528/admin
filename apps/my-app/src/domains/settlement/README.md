# 정산 관리 - JSONPlaceholder API 연동

## 📋 개요

정산 관리 시스템은 [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API의 Posts 데이터를 활용하여 실시간 정산 데이터를 제공합니다.

## 🔗 API 연동

### JSONPlaceholder API

- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Resource**: `/posts` (100개의 게시글 데이터)
- **월 요청량**: 약 30억 건 지원

### 데이터 변환

JSONPlaceholder의 Post 데이터를 Settlement(정산) 데이터로 변환:

```typescript
// 원본 데이터 (JSONPlaceholder Post)
{
  userId: 1,
  id: 1,
  title: "sunt aut facere...",
  body: "quia et suscipit..."
}

// 변환된 데이터 (Settlement)
{
  id: "ST-0001",
  site: "강남 헬스케어",
  amount: 2050000,
  period: "2025-01",
  status: "completed",
  date: "2025-01-04",
  description: "quia et suscipit..."
}
```

### 변환 로직

1. **정산 ID**: `ST-{post.id를 4자리로 패딩}`
   - 예: post.id = 1 → "ST-0001"

2. **Site명**: `siteNames[(userId - 1) % 20]`
   - userId를 기반으로 20개의 사이트명 중 하나 할당
   - 일관된 매핑 유지

3. **정산 금액**: `2,000,000 + ((id * 50,000) % 6,000,000)`
   - 200만원 ~ 800만원 사이
   - post.id를 기반으로 일관된 금액 생성

4. **정산 기간**: `id * 3일을 2025-01-01에 더한 날짜의 YYYY-MM`
   - 2025년 1월 ~ 12월 사이 분산

5. **처리일**: `id * 3일을 2025-01-01에 더한 날짜의 YYYY-MM-DD`
   - 정산 기간과 동일한 로직

6. **상태**: `id % 3 === 0 ? 'pending' : 'completed'`
   - 약 33%는 대기, 67%는 완료

7. **비고**: `post.body`
   - 원본 게시글 내용을 설명으로 사용

## 🏗️ 아키텍처

### 파일 구조

```
domains/settlement/
├── types/
│   └── settlement.ts              # Settlement, JsonPlaceholderPost 타입
├── services/
│   └── settlementService.ts       # API 호출 및 데이터 변환
├── columns/
│   └── settlementColumns.tsx      # 테이블 컬럼 정의
├── components/
│   └── SettlementTable.tsx        # 정산 테이블 UI
└── hooks/
    ├── useSettlements.ts          # 정산 데이터 페칭
    ├── useSettlementTable.ts      # 테이블 상태 관리
    └── useSettlementData.ts       # 데이터 로직
```

### 데이터 흐름

```
JSONPlaceholder API
    ↓
settlementService.getSettlements()
    ↓
transformPostToSettlement()
    ↓
Settlement[]
    ↓
useSettlements 훅
    ↓
useSettlementTable 훅
    ↓
SettlementTable 컴포넌트
    ↓
DataTable 컴포넌트 (shared)
```

## 🎨 UI 컴포넌트

### SettlementTable

**기능:**

- 실시간 API 데이터 표시
- 요약 통계 (총 금액, 완료/대기 건수)
- 상태별 필터링
- 검색 기능
- 페이지네이션

**Props:**

```typescript
interface SettlementTableProps {
  service: 'BODY' | 'FOOD' | 'MIND';
}
```

**요약 통계:**

1. **총 정산 금액**: 현재 페이지의 모든 정산 금액 합계
2. **정산 완료**: status === 'completed' 건수
3. **정산 대기**: status === 'pending' 건수

## 📊 테이블 컬럼

| 컬럼      | 키            | 설명                             | 너비  |
| --------- | ------------- | -------------------------------- | ----- |
| 정산 ID   | `id`          | ST-XXXX 형식                     | 120px |
| Site명    | `site`        | 센터/사이트 이름                 | 200px |
| 정산 기간 | `period`      | YYYY-MM 형식                     | 120px |
| 정산 금액 | `amount`      | 원화 표시                        | 150px |
| 처리일    | `date`        | YYYY-MM-DD 형식                  | 120px |
| 상태      | `status`      | 완료/대기 배지                   | 100px |
| 비고      | `description` | JSONPlaceholder body (최대 50자) | 300px |

## 🔍 필터링

### 상태 필터

```typescript
filters: [
  {
    columnId: 'status',
    title: '상태',
    options: [
      { label: '완료', value: 'completed' },
      { label: '대기', value: 'pending' },
    ],
  },
];
```

### 검색 기능

- **검색 대상**: 정산 ID, Site명
- **디바운스**: 300ms
- **검색 키**: `id` 컬럼

## 🚀 사용 예시

### 기본 사용

```tsx
import { SettlementTable } from '@/domains/settlement';

function SettlementPage() {
  return <SettlementTable service="BODY" />;
}
```

### 서비스별 테이블

```tsx
<SettlementTable service="BODY" />  // MY BODY 정산
<SettlementTable service="FOOD" />  // MY FOOD 정산
<SettlementTable service="MIND" />  // MY MIND 정산
```

## 🔧 API 함수

### getSettlements

**시그니처:**

```typescript
async function getSettlements(params?: GetSettlementsParams): Promise<{
  settlements: Settlement[];
  total: number;
  page: number;
  pageSize: number;
}>;
```

**파라미터:**

```typescript
interface GetSettlementsParams {
  page?: number; // 페이지 번호 (default: 1)
  pageSize?: number; // 페이지 크기 (default: 10)
  status?: string[]; // 상태 필터 ['completed', 'pending']
  service?: 'BODY' | 'FOOD' | 'MIND';
  filter?: string; // 검색어 (id, site 검색)
}
```

**동작:**

1. JSONPlaceholder API에서 모든 posts 가져오기
2. Posts를 Settlements로 변환
3. 필터 적용 (status, filter)
4. 페이지네이션 적용
5. 결과 반환

### getSettlement

**시그니처:**

```typescript
async function getSettlement(id: string): Promise<Settlement | undefined>;
```

**파라미터:**

- `id`: 정산 ID (예: "ST-0001")

**동작:**

1. ID에서 숫자 추출 (ST-0001 → 1)
2. JSONPlaceholder API에서 해당 post 가져오기
3. Post를 Settlement로 변환
4. 결과 반환

## 📈 성능 최적화

### 클라이언트 사이드 필터링

- API에서 한 번에 모든 데이터 가져오기 (100개)
- 클라이언트에서 필터링 및 페이지네이션
- 네트워크 요청 최소화

### 장점

1. **빠른 필터링**: 서버 왕복 없이 즉시 필터 적용
2. **오프라인 대응**: 초기 로드 후 네트워크 불필요
3. **비용 절감**: API 요청 최소화

### 단점

1. **초기 로딩**: 모든 데이터를 한 번에 로드
2. **메모리**: 100개 데이터를 메모리에 유지
3. **확장성**: 데이터가 많아지면 서버 페이지네이션 필요

## 🔄 확장 가능성

### 서버 페이지네이션으로 전환

실제 서비스에서는 서버 페이지네이션이 필요할 수 있습니다:

```typescript
// 클라이언트 페이지네이션 (현재)
const allData = await fetch('/api/settlements');
const filtered = applyFilters(allData);
const paginated = applyPagination(filtered);

// 서버 페이지네이션 (확장)
const paginated = await fetch('/api/settlements?page=1&pageSize=10&status=completed');
```

### 실제 API로 교체

```typescript
// JSONPlaceholder (현재)
const response = await fetch('https://jsonplaceholder.typicode.com/posts');

// 실제 API (미래)
const response = await fetch('/api/settlements', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 🧪 테스트

### API 테스트

```bash
# JSONPlaceholder API 동작 확인
curl https://jsonplaceholder.typicode.com/posts

# 특정 post 조회
curl https://jsonplaceholder.typicode.com/posts/1
```

### 데이터 변환 테스트

```typescript
const mockPost = {
  userId: 1,
  id: 1,
  title: 'test',
  body: 'test body',
};

const settlement = transformPostToSettlement(mockPost);

expect(settlement.id).toBe('ST-0001');
expect(settlement.site).toBe('강남 헬스케어');
expect(settlement.status).toBe('completed');
```

## 📚 참고 자료

- [JSONPlaceholder 공식 문서](https://jsonplaceholder.typicode.com/)
- [Shared DataTable 아키텍처](../../../../../packages/shared/docs/data-table/ARCHITECTURE.md)
- [TanStack Table 문서](https://tanstack.com/table/latest)

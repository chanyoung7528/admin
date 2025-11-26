# Faker.js를 활용한 Mock 데이터 생성

## 개요

`@faker-js/faker`를 사용하여 간단하고 일관된 Mock 데이터를 생성합니다. JSON:API, MSW 등의 복잡한 설정 없이 클라이언트 사이드에서 직접 데이터를 생성하고 필터링합니다.

## 설치

```bash
pnpm add -D @faker-js/faker
```

## 구현 방식

### Settlement 서비스 예시

```typescript
import { faker } from '@faker-js/faker';
import { type Settlement } from '../types';

// Faker seed 고정으로 일관된 데이터 생성
faker.seed(12345);

// 1000개의 Settlement 데이터 생성
export const settlements = Array.from({ length: 1000 }, (_, index) => {
  const statuses: Settlement['status'][] = ['completed', 'pending'];
  const sites = [
    '강남 헬스케어',
    '서초 웰니스',
    '판교 케어센터',
    '삼성 메디컬',
    '역삼 웰빙센터',
    '신사 클리닉',
    '압구정 센터',
    '청담 헬스',
    '도곡 웰니스',
    '대치 메디컬',
  ];

  return {
    id: `ST-2025-${String(index + 1).padStart(4, '0')}`,
    site: faker.helpers.arrayElement(sites),
    amount: faker.number.int({ min: 2000000, max: 8000000 }),
    period: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 7),
    status: faker.helpers.arrayElement(statuses),
    date: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 10),
  } satisfies Settlement;
});
```

## 주요 특징

### 1. **고정 Seed**

```typescript
faker.seed(12345);
```

- 페이지를 새로고침해도 동일한 데이터 생성
- 개발/테스트 시 일관된 환경 제공

### 2. **간단한 데이터 생성**

```typescript
faker.number.int({ min: 2000000, max: 8000000 });
faker.date.between({ from: '2025-01-01', to: '2025-12-31' });
faker.helpers.arrayElement(['completed', 'pending']);
```

### 3. **클라이언트 사이드 필터링**

```typescript
export async function getSettlements(params?: GetSettlementsParams) {
  const { page = 1, pageSize = 10, status, filter } = params || {};

  // 필터 적용
  let filteredData = [...settlements];

  if (status && status.length > 0) {
    filteredData = filteredData.filter(item => status.includes(item.status));
  }

  if (filter) {
    const searchLower = filter.toLowerCase();
    filteredData = filteredData.filter(item => item.id.toLowerCase().includes(searchLower) || item.site.toLowerCase().includes(searchLower));
  }

  // 페이지네이션
  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    settlements: paginatedData,
    total,
    page,
    pageSize,
  };
}
```

## 데이터 구조

### Settlement 타입

```typescript
interface Settlement {
  id: string; // ST-2025-0001 ~ ST-2025-1000
  site: string; // 10개의 Site 중 랜덤 선택
  amount: number; // 2M ~ 8M 랜덤
  period: string; // 2025-01 ~ 2025-12 랜덤
  status: 'completed' | 'pending'; // 랜덤 선택
  date: string; // 2025년 내 랜덤 날짜
}
```

## Faker.js 주요 메서드

### 숫자 생성

```typescript
faker.number.int({ min: 1000, max: 9999 });
faker.number.float({ min: 0, max: 100, fractionDigits: 2 });
```

### 날짜 생성

```typescript
faker.date.past(); // 과거 날짜
faker.date.future(); // 미래 날짜
faker.date.recent(); // 최근 날짜
faker.date.between({ from: '2025-01-01', to: '2025-12-31' });
```

### 텍스트 생성

```typescript
faker.lorem.sentence({ min: 5, max: 15 });
faker.lorem.paragraph({ min: 1, max: 3 });
faker.lorem.words(3);
```

### 사람 정보

```typescript
faker.person.fullName();
faker.person.firstName();
faker.person.lastName();
faker.internet.email();
faker.phone.number();
```

### 배열에서 랜덤 선택

```typescript
faker.helpers.arrayElement(['todo', 'in progress', 'done']);
faker.helpers.shuffle([1, 2, 3, 4, 5]);
```

## 네트워크 지연 시뮬레이션

실제 API처럼 지연을 추가하여 로딩 상태 테스트:

```typescript
// 300ms 지연
await new Promise(resolve => setTimeout(resolve, 300));
```

## Task 예시 (참고용)

```typescript
import { faker } from '@faker-js/faker';

faker.seed(12345);

export const tasks = Array.from({ length: 3000 }, () => {
  const statuses = ['todo', 'in progress', 'done', 'canceled', 'backlog'] as const;
  const labels = ['bug', 'feature', 'documentation'] as const;
  const priorities = ['low', 'medium', 'high'] as const;

  return {
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(statuses),
    label: faker.helpers.arrayElement(labels),
    priority: faker.helpers.arrayElement(priorities),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    assignee: faker.person.fullName(),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    dueDate: faker.date.future(),
  };
});
```

## 장점

### 1. **간단함**

- 복잡한 API 모킹 설정 불필요
- MSW, JSON:API 스펙 등 불필요
- 코드 몇 줄로 대량의 Mock 데이터 생성

### 2. **일관성**

- Seed 고정으로 항상 동일한 데이터
- 팀원 간 동일한 개발 환경

### 3. **유연성**

- 필요한 만큼 데이터 생성 가능 (1000개, 3000개 등)
- 다양한 데이터 타입 지원
- 커스터마이징 쉬움

### 4. **실제 API 전환 용이**

```typescript
// 개발: Faker 데이터
export const settlements = Array.from({ length: 1000 }, ...);

// 프로덕션: 실제 API 호출로 교체
export async function getSettlements(params) {
  const response = await api.get('/settlements', { params });
  return response.data;
}
```

## 다른 도메인 적용 예시

### User 도메인

```typescript
import { faker } from '@faker-js/faker';

faker.seed(12345);

export const users = Array.from({ length: 500 }, (_, index) => ({
  id: `USER-${String(index + 1).padStart(4, '0')}`,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  role: faker.helpers.arrayElement(['admin', 'user', 'guest']),
  createdAt: faker.date.past().toISOString(),
  lastLogin: faker.date.recent().toISOString(),
}));
```

### Order 도메인

```typescript
import { faker } from '@faker-js/faker';

faker.seed(12345);

export const orders = Array.from({ length: 2000 }, (_, index) => ({
  id: `ORDER-${String(index + 1).padStart(5, '0')}`,
  customerName: faker.person.fullName(),
  product: faker.commerce.productName(),
  amount: faker.number.int({ min: 10000, max: 500000 }),
  status: faker.helpers.arrayElement(['pending', 'paid', 'shipped', 'delivered']),
  orderDate: faker.date.past().toISOString().slice(0, 10),
}));
```

## 참고 자료

- [Faker.js 공식 문서](https://fakerjs.dev/)
- [Faker.js API Reference](https://fakerjs.dev/api/)

## 요약

Faker.js는 빠르고 간단하게 대량의 Mock 데이터를 생성할 수 있는 최고의 선택입니다. 복잡한 API 모킹 없이도 실제와 유사한 개발 환경을 구축할 수 있습니다.

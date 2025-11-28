# Faker 기반 Mock 데이터 전략

## 1. 핵심 개념

- Faker seed 를 고정하여 모든 팀원이 동일한 데이터를 공유합니다.
- mock 데이터는 클라이언트 안에서 생성되지만, API 호출 형태(`getSettlements`)를 유지해 실제 백엔드로 전환하기 쉽습니다.
- 현재는 Settlement 도메인만 Faker를 사용하고 있습니다.

## 2. 구현 요약

```ts
// apps/my-app/src/domains/settlement/services/settlementService.ts
faker.seed(12345);

export const settlements = Array.from({ length: 1000 }, (_, index) => ({
  id: `ST-${index + 1}`,
  site: faker.helpers.arrayElement(extendedSites),
  amount: faker.number.int({ min: 2_000_000, max: 8_000_000 }),
  period: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 7),
  status: faker.helpers.arrayElement(['completed', 'pending']),
  date: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 10),
}));
```

- `extendedSites` 는 30개 이상의 센터명을 포함하여 반복되는 Site 비율을 줄였습니다.
- `description` 필드는 타입상 optional 이지만 현재는 사용하지 않습니다.

## 3. API 시그니처

```ts
export async function getSettlements(params?: GetSettlementsParams): Promise<{
  settlements: Settlement[];
  total: number;
  page: number;
  pageSize: number;
}> { ... }
```

1. 상태 필터 (`status: string[]`)
2. 글로벌 검색 (`filter`: 정산 ID + Site명)
3. 정렬 (`sortBy`, `sortOrder`) — description 필드는 정렬 대상에서 제외
4. 페이지네이션 후 300ms 지연으로 네트워크 환경을 흉내냄

```ts
const total = filteredData.length;
const startIndex = (page - 1) * pageSize;
const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
await new Promise(resolve => setTimeout(resolve, 300));
```

## 4. 장점

| 항목     | 설명                                              |
| -------- | ------------------------------------------------- |
| 재현성   | seed 고정으로 QA/디자이너와 동일 데이터 사용      |
| 속도     | API 서버 없이도 pagination/필터/정렬 테스트 가능  |
| 유지보수 | Faker 호출만 교체하면 실제 API 연동으로 변경 가능 |

## 5. 실제 API로 전환 시

1. `settlementService.ts` 의 `settlements` 상수 제거
2. `getSettlements` 내부에서 `await api.get('/settlements', { params })` 호출
3. 응답을 `{ settlements, total, page, pageSize }` 형태로 매핑
4. Faker 관련 유틸/seed 를 제거하거나 테스트용으로만 남김

## 6. Faker 팁

| 목적      | 메서드                                                    |
| --------- | --------------------------------------------------------- |
| 금액/숫자 | `faker.number.int({ min, max })`                          |
| 날짜      | `faker.date.between({ from, to })`, `faker.date.recent()` |
| 배열 샘플 | `faker.helpers.arrayElement(array)`                       |
| 텍스트    | `faker.lorem.sentence({ min, max })`                      |

Seed 를 변경하면 전체 데이터가 바뀌므로, QA 시나리오가 안정될 때까지는 `faker.seed(12345)` 를 유지해 주세요.

# 정산 도메인 (Settlement)

## 1. 데이터 생성

- `@faker-js/faker` 로 1,000개의 mock 데이터를 만듭니다. (`services/settlementService.ts`)
- 필드
  - `id`: `ST-${index + 1}`
  - `site`: `extendedSites` 배열(30개 이상)에서 랜덤 선택
  - `amount`: 2,000,000 ~ 8,000,000
  - `period`: 2025년 범위의 `YYYY-MM`
  - `date`: 2025년 범위의 `YYYY-MM-DD`
  - `status`: `completed` 또는 `pending`
- API 호출을 흉내 내기 위해 300ms 지연을 추가합니다.

```ts
export async function getSettlements(params?: GetSettlementsParams) {
  // 필터 → 정렬 → 페이지네이션
  await new Promise(resolve => setTimeout(resolve, 300));
  return { settlements: paginatedData, total, page, pageSize };
}
```

## 2. 아키텍처

```
domains/settlement/
├── columns/settlementColumns.tsx
├── components/SettlementTable.tsx
├── hooks/{useSettlements,useSettlementTable}.ts
├── services/settlementService.ts
└── types/settlement.ts
```

데이터 흐름

```
getSettlements (faker)
  ↓
useSettlements (React Query)
  ↓
useSettlementTable (useDataTableController)
  ↓
SettlementTable (요약 카드 + DataTable)
```

## 3. 검색/필터/정렬

- 상태 필터: `columnId = status`, URL search key `status`
- 글로벌 검색: 정산 ID + Site (500ms 디바운스)
- 정렬: `sortBy`, `sortOrder` 를 React Query 파라미터로 전달 (`description` 컬럼은 제외)

## 4. 페이지 연동

`apps/my-app/src/pages/_authenticated/my-food/settlement.tsx`

```ts
const settlementSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  status: z.array(z.string()).catch([]),
  filter: z.string().catch(''),
});
```

`validateSearch` → `useTableUrlState` → `useDataTableController` 순으로 전달되어 URL 과 테이블 상태가 항상 싱크됩니다.

## 5. TODO

- 실제 API 연동 시 `getSettlements` 만 교체하면 나머지 훅/컴포넌트는 그대로 재사용할 수 있습니다.
- `useSettlementData.ts` 는 현재 미사용이므로 필요 시 삭제 또는 통합하세요.

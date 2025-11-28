# DataTable 공용 구현 가이드

## 1. 왜 shared DataTable 인가?

- 테이블마다 필터/검색/pagination 보일러플레이트를 작성하지 않기 위해 `packages/shared/src/components/data-table/*` 에 모든 로직을 모았습니다.
- URL 상태가 단일 출처이므로 브라우저 뒤로가기/퍼머링크 공유가 가능합니다.
- Settlement 와 같이 데이터가 늘어나는 화면에서 서버 사이드 페이지네이션을 바로 적용할 수 있습니다.

## 2. 구성 요소

| 파일                                | 역할                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| `data-table.tsx`                    | TanStack Table 래퍼 (`useDataTableState` 내부 사용)       |
| `toolbar.tsx`, `faceted-filter.tsx` | 검색 인풋, 패싯 필터 UI                                   |
| `pagination.tsx`                    | 페이지 번호/크기 조절                                     |
| `useDataTableController.ts`         | URL 상태 ↔ React Query ↔ DataTable Props 오케스트레이션 |
| `useTableUrlState.ts`               | page/pageSize/filter/status 를 search params 로 직렬화    |

## 3. SettlementTable 파이프라인

1. **타입**: `apps/my-app/src/domains/settlement/types/settlement.ts`
2. **컬럼**: `.../columns/settlementColumns.tsx`
3. **데이터**: `.../services/settlementService.ts` (Faker 기반 Mock)
4. **React Query 훅**: `.../hooks/useSettlements.ts`
5. **컨트롤러 훅**: `.../hooks/useSettlementTable.ts` → `useDataTableController` 호출
6. **컴포넌트**: `.../components/SettlementTable.tsx` → `<DataTable {...tableProps} />`

```tsx
// apps/my-app/src/domains/settlement/components/SettlementTable.tsx
const { tableProps, data, isError, isLoading } = useSettlementTable({ service });
const totalAmount = data.reduce((sum, settlement) => sum + settlement.amount, 0);

return (
  <div className="rounded-lg border p-4">
    <SummaryCards total={totalAmount} completed={...} pending={...} loading={isLoading} />
    {isError && <InlineError />}
    <DataTable {...tableProps} />
  </div>
);
```

## 4. URL 동기화

```tsx
// apps/my-app/src/pages/_authenticated/my-food/settlement.tsx
const settlementSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  status: z.array(z.string()).catch([]),
  filter: z.string().catch(''),
});

export const Route = createFileRoute('/_authenticated/my-food/settlement')({
  component: FoodSettlementPage,
  validateSearch: settlementSearchSchema,
});
```

`useDataTableController` 는 `useSearch` 와 `navigate` 를 받아 URL search params 를 그대로 사용합니다. 따라서 페이지/필터가 변경될 때마다 주소가 업데이트되고 새로고침에도 동일 상태를 복원할 수 있습니다.

## 5. UserListTable TODO

- 현 시점의 `apps/my-app/src/domains/user/components/UserListTable.tsx` 는 placeholder UI 입니다.
- DataTable 을 적용하려면 Settlement 흐름을 그대로 복제한 뒤 컬럼/정렬/필터만 교체하면 됩니다.
- 체크리스트:
  1. `types/user.ts`, `columns/userColumns.tsx` 준비
  2. `services/userService.ts` (또는 실제 API) 작성
  3. `hooks/useUsers.ts` → React Query로 감싸기
  4. `hooks/useUserTable.ts` 생성 (`tableId: 'user-list'`)
  5. `UserListTable` 내부에서 `<DataTable {...tableProps} />` 렌더

## 6. 새로운 도메인에 적용하는 순서

1. **타입 정의**  
   `apps/my-app/src/domains/<domain>/types/<domain>.ts`
2. **컬럼 정의**  
   TanStack `ColumnDef` 배열과 meta(className 등) 작성
3. **서비스 + Query 훅**  
   API 응답을 `{ data, total, isLoading, isError }` 형태로 맞추기
4. **컨트롤러 훅**  
   `useDataTableController<TData, TValue>` 호출
5. **컴포넌트**  
   통계/엑션 버튼 → `<DataTable {...tableProps} />` 순으로 배치

> URL 파라미터 필요 시 `filterConfigs`, `queryParams` 를 꼭 지정하세요. 지정하지 않으면 search 필드가 URL에서 빠집니다.

## 7. 참고 링크

- `docs/DATA_TABLE_PAGINATION.md` : pageCount, queryKey, 디버깅
- `packages/shared/src/components/data-table/docs/ARCHITECTURE.md` : 내부 훅 상세
- `docs/FAKER_SETUP.md` : Mock 데이터 스펙

## 8. 점검 목록

- [ ] `tableId` 가 화면마다 고유한가?
- [ ] `useQueryHook` 가 `{ data, total }` 형식을 반환하는가?
- [ ] URL search schema 와 `filterConfigs` 가 동일한 키를 사용하고 있는가?
- [ ] `pageCount` 계산 시 `total` 이 undefined 인 경우를 처리했는가?
- [ ] 로딩/에러/empty 상태가 UX 요구사항과 맞는가?

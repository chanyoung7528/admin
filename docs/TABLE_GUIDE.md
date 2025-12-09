# 테이블 개발 가이드

DataTable 컴포넌트와 컨트롤러 패턴으로 테이블을 빠르게 구현하는 방법을 설명합니다.

## 핵심 개념

컨트롤러 훅(`useXxxTable`)으로 테이블 로직을 캡슐화하여 재사용성을 높입니다.

**주요 기능**: 페이지네이션, 필터, 정렬, 검색, URL 동기화

**관련 문서**: [TanStack Table 공식 문서](https://tanstack.com/table/latest), [DataTable 컴포넌트](../packages/shared/src/components/data-table/README.md)

## 빠른 시작

### 1단계: 타입과 컬럼 정의

```tsx
// domains/settlement/types/settlement.ts
export interface Settlement {
  id: number;
  site: string;
  amount: number;
  status: 'pending' | 'completed';
}

// domains/settlement/columns/settlementColumns.tsx
export const settlementColumns: ColumnDef<Settlement>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'site', header: '사이트' },
  { accessorKey: 'amount', header: '금액' },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
  },
];
```

### 2단계: API 서비스 및 훅

```tsx
// services/settlementService.ts
export async function getSettlements(params) {
  const { data } = await api.get('/settlements', { params });
  return data;
}

// hooks/useSettlements.ts
export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
  });
}
```

### 3단계: 테이블 컨트롤러 훅

```tsx
// hooks/useSettlementTable.ts
export function useSettlementTable() {
  return useDataTableController({
    tableId: 'settlement',
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: columnFilters.find(f => f.id === 'status')?.value,
      filter: globalFilter,
    }),
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
    renderFilters: () => [
      {
        columnId: 'status',
        title: '상태',
        options: [
          { label: '완료', value: 'completed' },
          { label: '대기', value: 'pending' },
        ],
      },
    ],
  });
}
```

### 4단계: 컴포넌트에서 사용

```tsx
// components/SettlementTable.tsx
export function SettlementTable() {
  const { tableProps } = useSettlementTable();
  return <DataTable {...tableProps} />;
}

// 페이지에서 사용
<SettlementTable />;
```

## 주요 옵션

### 페이지네이션

```tsx
// 서버 페이지네이션
manualPagination: true,
pageCount: (data) => Math.ceil((data?.total || 0) / pageSize),

// 클라이언트 페이지네이션
manualPagination: false,
```

### 정렬

```tsx
// 컬럼에 정렬 버튼 추가
header: ({ column }) => (
  <button onClick={() => column.toggleSorting()}>사이트</button>
),
```

### 행 선택

```tsx
const [rowSelection, setRowSelection] = useState({});
<DataTable {...tableProps} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />;
```

### 툴바 커스터마이징

```tsx
<DataTable {...tableProps} renderToolbarActions={() => <Button onClick={handleExport}>엑셀 다운로드</Button>} />
```

## 체크리스트

**필수**

- ✅ 컬럼은 별도 파일로 분리
- ✅ 테이블 로직은 커스텀 훅으로 캡슐화
- ✅ filterConfigs에 필터 등록 (URL 동기화)
- ✅ API 응답에 total 포함 (서버 페이지네이션)

**권장**

- ✅ 서버 페이지네이션 사용 (대용량 데이터)
- ✅ 컬럼 메모이제이션
- ✅ placeholderData로 이전 데이터 유지

## 관련 가이드

- [DataTable 컴포넌트](../packages/shared/src/components/data-table/README.md) - 컴포넌트 API
- [API 통합 가이드](API_INTEGRATION.md) - 서비스/훅 패턴
- [도메인 구조](DOMAIN_STRUCTURE.md) - 파일 구조
- [TanStack Table](https://tanstack.com/table/latest) - 공식 문서

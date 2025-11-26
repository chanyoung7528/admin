import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

interface UseDataTableStateProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Controlled states
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  globalFilterFn?: (row: unknown, columnId: string, filterValue: unknown) => boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // Options
  enableRowSelection?: boolean;
  ensurePageInRange?: (pageCount: number) => void;
}

export function useDataTableState<TData, TValue>({
  columns,
  data,
  pagination: controlledPagination,
  onPaginationChange,
  pageCount,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  globalFilterFn,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  sorting: controlledSorting,
  onSortingChange,
  enableRowSelection = false,
  ensurePageInRange,
}: UseDataTableStateProps<TData, TValue>) {
  // Local state (uncontrolled mode)
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>([]);
  const [localGlobalFilter, setLocalGlobalFilter] = useState('');
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [localRowSelection, setLocalRowSelection] = useState<RowSelectionState>({});
  const [localColumnVisibility, setLocalColumnVisibility] = useState<VisibilityState>({});

  // 현재 적용된 상태 값 계산 (Controlled ?? Local)
  const currentSorting = controlledSorting ?? localSorting;
  const currentColumnVisibility = controlledColumnVisibility ?? localColumnVisibility;
  const currentRowSelection = controlledRowSelection ?? localRowSelection;
  const currentColumnFilters = controlledColumnFilters ?? localColumnFilters;
  const currentGlobalFilter = controlledGlobalFilter ?? localGlobalFilter;
  const currentPagination = controlledPagination ?? localPagination;

  // 테이블 인스턴스 생성
  // Note: React Compiler warning은 정상입니다. TanStack Table은 함수를 반환하므로 메모이제이션이 제한됩니다.
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: currentSorting,
      columnVisibility: currentColumnVisibility,
      rowSelection: currentRowSelection,
      columnFilters: currentColumnFilters,
      globalFilter: currentGlobalFilter,
      pagination: currentPagination,
    },
    pageCount: pageCount ?? -1,
    manualPagination: !!onPaginationChange,
    enableRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setLocalRowSelection,
    onSortingChange: onSortingChange ?? setLocalSorting,
    onColumnVisibilityChange: onColumnVisibilityChange ?? setLocalColumnVisibility,
    onColumnFiltersChange: onColumnFiltersChange ?? setLocalColumnFilters,
    onGlobalFilterChange: onGlobalFilterChange ?? setLocalGlobalFilter,
    onPaginationChange: onPaginationChange ?? setLocalPagination,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // 페이지 카운트 변경 시 페이지 범위 확인
  const tablePageCount = table.getPageCount();

  useEffect(() => {
    if (ensurePageInRange) {
      ensurePageInRange(tablePageCount);
    }
  }, [tablePageCount, ensurePageInRange]);

  // 행 데이터
  const rowModel = table.getRowModel();
  const rows = rowModel.rows;
  const hasRows = rows.length > 0;

  // Pagination 컴포넌트 리렌더링을 위한 key
  const paginationKey = useMemo(() => {
    return `${currentPagination.pageIndex}-${currentPagination.pageSize}-${pageCount ?? 'unknown'}-${data.length}`;
  }, [currentPagination.pageIndex, currentPagination.pageSize, pageCount, data.length]);

  // 필터 적용 여부
  const isFiltered = currentColumnFilters.length > 0 || !!currentGlobalFilter;

  return {
    table,
    rows,
    hasRows,
    paginationKey,
    isFiltered,
    currentPagination,
  };
}

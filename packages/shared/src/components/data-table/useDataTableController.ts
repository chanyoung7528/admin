import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef, ColumnFiltersState, PaginationState, Row, SortingState } from '@tanstack/react-table';
import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DataTableProps } from './data-table';
import { type NavigateFn, useTableUrlState } from './useTableUrlState';

interface FilterConfig {
  columnId: string;
  searchKey: string;
  type?: 'string' | 'array';
}

interface UseDataTableControllerParams<TData, TValue> {
  tableId: string;
  columns: ColumnDef<TData, TValue>[];
  useQueryHook: (params: Record<string, unknown>) => {
    data: TData[] | undefined;
    total?: number;
    isLoading: boolean;
    isError: boolean;
  };
  queryParams?: (urlState: {
    pagination: PaginationState;
    columnFilters: ColumnFiltersState;
    globalFilter?: string;
    sorting?: SortingState;
  }) => Record<string, unknown>;
  filterConfigs?: FilterConfig[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  globalFilterFn?: (row: Row<TData>, columnId: string, filterValue: unknown) => boolean;
  renderFilters?: (columnFilters: ColumnFiltersState) => DataTableProps<TData, TValue>['filters'];
  defaultPageSize?: number;
  /** 검색어 디바운스 시간 (ms). 기본값: 500ms */
  searchDebounceMs?: number;
}

export interface UseDataTableControllerReturn<TData, TValue> {
  tableProps: DataTableProps<TData, TValue>;
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  globalFilter?: string;
}

export function useDataTableController<TData, TValue>({
  tableId,
  columns,
  useQueryHook,
  queryParams,
  filterConfigs = [],
  searchPlaceholder = '검색...',
  emptyMessage = '데이터가 없습니다.',
  globalFilterFn,
  renderFilters,
  defaultPageSize = 10,
  searchDebounceMs = 500,
}: UseDataTableControllerParams<TData, TValue>): UseDataTableControllerReturn<TData, TValue> {
  const routerNavigate = useNavigate();
  const searchParams = useSearch({ strict: false });

  const navigate: NavigateFn = useCallback(
    ({ search }) => {
      if (typeof search === 'function') {
        const result = search(searchParams);
        void routerNavigate({
          search: result as never,
        });
      } else if (search !== true) {
        void routerNavigate({
          search: search as never,
        });
      }
    },
    [routerNavigate, searchParams]
  );

  const { globalFilter, onGlobalFilterChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search: searchParams,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: filterConfigs,
  });

  // 검색어를 위한 로컬 상태 (즉시 UI 업데이트용)
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState(globalFilter);
  const [isSearching, setIsSearching] = useState(false);
  const isInitialMount = useRef(true);

  // 디바운스된 업데이트 함수
  const debouncedUpdate = useRef(
    debounce((value: string | undefined) => {
      setDebouncedGlobalFilter(value);
      setIsSearching(false);
    }, searchDebounceMs)
  ).current;

  // globalFilter 변경 시 디바운스 적용
  useEffect(() => {
    // 초기 마운트 시에는 디바운스 없이 즉시 설정
    if (isInitialMount.current) {
      setDebouncedGlobalFilter(globalFilter);
      isInitialMount.current = false;
      return;
    }

    if (globalFilter !== debouncedGlobalFilter) {
      setIsSearching(true);
      debouncedUpdate(globalFilter);
    }

    return () => {
      debouncedUpdate.cancel();
    };
  }, [globalFilter, debouncedGlobalFilter, debouncedUpdate]);

  // URL에서 정렬 파라미터 읽기
  const sorting = useMemo(() => {
    const params = searchParams as Record<string, unknown>;
    const sortBy = params.sortBy as string | undefined;
    const sortOrder = params.sortOrder as string | undefined;
    if (sortBy) {
      return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }
    return [];
  }, [searchParams]);

  // 정렬 변경 핸들러
  const onSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      const sortItem = newSorting[0];

      navigate({
        search: prev => ({
          ...prev,
          sortBy: sortItem?.id,
          sortOrder: sortItem?.desc ? 'desc' : 'asc',
        }),
      });
    },
    [navigate, sorting]
  );

  const apiParams = useMemo(() => {
    if (queryParams) {
      return queryParams({ pagination, columnFilters, globalFilter: debouncedGlobalFilter, sorting });
    }
    return {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filter: debouncedGlobalFilter && debouncedGlobalFilter.trim() !== '' ? debouncedGlobalFilter : undefined,
    };
  }, [pagination, columnFilters, debouncedGlobalFilter, sorting, queryParams]);

  const queryResult = useQueryHook(apiParams);
  const { data: rawData, total, isLoading, isError } = queryResult;

  const data = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

  const pageCount = total && total > 0 ? Math.ceil(total / pagination.pageSize) : undefined;

  useEffect(() => {
    if (pageCount) {
      ensurePageInRange(pageCount);
    }
  }, [pageCount, ensurePageInRange]);

  // 검색 중이거나 API 로딩 중일 때 로딩 표시
  const effectiveIsLoading = isLoading || isSearching;

  const tableProps = useMemo(
    () =>
      ({
        instanceId: tableId,
        columns,
        data,
        pagination,
        onPaginationChange,
        pageCount,
        columnFilters,
        onColumnFiltersChange,
        globalFilter,
        onGlobalFilterChange,
        sorting,
        onSortingChange,
        ensurePageInRange,
        searchPlaceholder,
        filters: renderFilters?.(columnFilters),
        emptyMessage: effectiveIsLoading ? '로딩 중...' : emptyMessage,
        isLoading: effectiveIsLoading,
        globalFilterFn,
      }) as DataTableProps<TData, TValue>,
    [
      tableId,
      columns,
      data,
      pagination,
      onPaginationChange,
      pageCount,
      columnFilters,
      onColumnFiltersChange,
      globalFilter,
      onGlobalFilterChange,
      sorting,
      onSortingChange,
      ensurePageInRange,
      searchPlaceholder,
      renderFilters,
      emptyMessage,
      effectiveIsLoading,
      globalFilterFn,
    ]
  );

  return {
    tableProps,
    data,
    isLoading: effectiveIsLoading,
    isError,
    pagination,
    columnFilters,
    globalFilter,
  };
}

import type { ColumnFiltersState, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
// useEffect를 제거했습니다.

type SearchRecord = Record<string, unknown>;

export type NavigateFn = (opts: { search: true | SearchRecord | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord); replace?: boolean }) => void;

type UseTableUrlStateParams = {
  search: SearchRecord;
  navigate: NavigateFn;
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
  };
  columnFilters?: Array<
    | {
        columnId: string;
        searchKey: string;
        type?: 'string';
        // Optional transformers for custom types
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
    | {
        columnId: string;
        searchKey: string;
        type: 'array';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
  >;
};

type UseTableUrlStateReturn = {
  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  // Column filters
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  // Pagination
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  // Helpers
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: 'first' | 'last' }) => void;
};

export function useTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const { search, navigate, pagination: paginationCfg, globalFilter: globalFilterCfg, columnFilters: columnFiltersCfg = [] } = params;

  const pageKey = paginationCfg?.pageKey ?? ('page' as string);
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ('pageSize' as string);
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

  const globalFilterKey = globalFilterCfg?.key ?? ('filter' as string);
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
  const trimGlobal = globalFilterCfg?.trim ?? true;

  // Build initial column filters from the current search params
  // 이것이 이제 columnFilters의 유일한 출처(Source of Truth)입니다.
  const columnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = (search as SearchRecord)[cfg.searchKey];
      const deserialize = cfg.deserialize ?? ((v: unknown) => v);

      // raw 값이 null, undefined, 빈 문자열이 아닌 경우에만 필터를 추가합니다.
      if (raw === null || raw === undefined || (typeof raw === 'string' && raw.trim() === '')) {
        continue;
      }

      if (cfg.type === 'string' || cfg.type === undefined) {
        const value = (deserialize(raw) as string) ?? '';
        if (typeof value === 'string' && value.trim() !== '') {
          collected.push({ id: cfg.columnId, value });
        }
      } else if (cfg.type === 'array') {
        // 배열 타입은 쉼표 등으로 구분된 문자열로 URL에 들어오므로,
        // deserializer가 배열로 변환하는 역할을 해야 합니다.
        // 예: 'completed,pending' -> ['completed', 'pending']
        const value = (deserialize(raw) as unknown[]) ?? [];
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value });
        }
      }
    }
    return collected;
  }, [columnFiltersCfg, search]);

  // ----------------------------------------------------
  // 기존의 columnFilters 로컬 상태 및 동기화 useEffect 제거
  // ----------------------------------------------------

  const pagination: PaginationState = useMemo(() => {
    const rawPage = (search as SearchRecord)[pageKey];
    const rawPageSize = (search as SearchRecord)[pageSizeKey];
    const pageNum = typeof rawPage === 'number' ? rawPage : defaultPage;
    const pageSizeNum = typeof rawPageSize === 'number' ? rawPageSize : defaultPageSize;
    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

  const onPaginationChange: OnChangeFn<PaginationState> = updater => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    const nextPage = next.pageIndex + 1;
    const nextPageSize = next.pageSize;
    navigate({
      search: prev => ({
        ...(prev as SearchRecord),
        [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
        [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : nextPageSize,
      }),
    });
  };

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
    if (!globalFilterEnabled) return undefined;
    const raw = (search as SearchRecord)[globalFilterKey];
    return typeof raw === 'string' ? raw : '';
  });

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled
    ? updater => {
        const next = typeof updater === 'function' ? updater(globalFilter ?? '') : updater;
        const value = trimGlobal ? next.trim() : next;
        setGlobalFilter(value);
        navigate({
          search: prev => ({
            ...(prev as SearchRecord),
            [pageKey]: undefined,
            [globalFilterKey]: value ? value : undefined,
          }),
        });
      }
    : undefined;

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = updater => {
    // columnFilters는 이제 URL에서 파생된 값이므로, updater를 사용하여 다음 상태를 계산합니다.
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    // [❌ 제거] setColumnFilters(next); 로컬 상태 업데이트를 제거했습니다.

    const patch: Record<string, unknown> = {};

    for (const cfg of columnFiltersCfg) {
      const found = next.find(f => f.id === cfg.columnId);
      const serialize = cfg.serialize ?? ((v: unknown) => v);

      if (cfg.type === 'string' || cfg.type === undefined) {
        const value = typeof found?.value === 'string' ? (found.value as string) : '';
        // 값이 없으면 undefined로 설정하여 URL에서 제거
        patch[cfg.searchKey] = value.trim() !== '' ? serialize(value) : undefined;
      } else if (cfg.type === 'array') {
        const value = Array.isArray(found?.value) ? (found!.value as unknown[]) : [];
        // 값이 없으면 undefined로 설정하여 URL에서 제거
        patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined;
      }
    }

    navigate({
      search: prev => ({
        ...(prev as SearchRecord),
        [pageKey]: undefined, // 필터가 변경되면 1페이지로 리셋
        ...patch,
      }),
    });
  };

  const ensurePageInRange = (pageCount: number, opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }) => {
    const currentPage = (search as SearchRecord)[pageKey];
    const pageNum = typeof currentPage === 'number' ? currentPage : defaultPage;
    if (pageCount > 0 && pageNum > pageCount) {
      navigate({
        replace: true,
        search: prev => ({
          ...(prev as SearchRecord),
          [pageKey]: opts.resetTo === 'last' ? pageCount : undefined,
        }),
      });
    }
  };

  return {
    globalFilter: globalFilterEnabled ? (globalFilter ?? '') : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  };
}

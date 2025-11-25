import type { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';

interface UseTableInstanceKeyParams {
  tableId?: string;
  pagination?: PaginationState;
  globalFilter?: string;
  columnFilters?: ColumnFiltersState;
  extraDeps?: ReadonlyArray<unknown>;
}

function serializeFilterValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map(item => serializeFilterValue(item))
      .sort()
      .join(',');
  }

  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function serializeColumnFilters(filters: ColumnFiltersState | undefined): string {
  if (!filters || filters.length === 0) {
    return 'no-filters';
  }

  return [...filters]
    .map(filter => `${filter.id}:${serializeFilterValue(filter.value)}`)
    .sort()
    .join('|');
}

function serializeExtraDeps(extraDeps: ReadonlyArray<unknown> | undefined): string {
  if (!extraDeps || extraDeps.length === 0) {
    return 'no-extra';
  }

  return extraDeps.map(dep => serializeFilterValue(dep)).join('|');
}

export function useTableInstanceKey({ tableId = 'data-table', pagination, globalFilter, columnFilters, extraDeps }: UseTableInstanceKeyParams): string {
  const paginationKey = useMemo(() => {
    if (!pagination) return 'no-pagination';
    return `page-${pagination.pageIndex}-size-${pagination.pageSize}`;
  }, [pagination]);

  const globalFilterKey = useMemo(() => {
    const trimmed = globalFilter?.trim();
    return trimmed && trimmed.length > 0 ? `global-${trimmed}` : 'global-none';
  }, [globalFilter]);

  const filtersKey = useMemo(() => serializeColumnFilters(columnFilters), [columnFilters]);
  const extraKey = useMemo(() => serializeExtraDeps(extraDeps), [extraDeps]);

  return useMemo(
    () => `${tableId}__${paginationKey}__${globalFilterKey}__${filtersKey}__${extraKey}`,
    [tableId, paginationKey, globalFilterKey, filtersKey, extraKey]
  );
}

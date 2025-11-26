import { cn } from '@shared/lib/utils';
import { Skeleton } from '@shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  flexRender,
} from '@tanstack/react-table';
import { useDataTableState } from './hooks';
import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';

// Custom meta type extension
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
    thClassName?: string;
    tdClassName?: string;
  }
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  // Search & Filter
  searchPlaceholder?: string;
  searchKey?: string;
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  // Pagination
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  // Column filters
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  globalFilterFn?: (row: unknown, columnId: string, filterValue: unknown) => boolean;
  // Row selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  // Column visibility
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  // Sorting
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // UI
  showToolbar?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
  className?: string;
  // Loading
  isLoading?: boolean;
  // Callbacks
  ensurePageInRange?: (pageCount: number) => void;
  instanceId?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  searchKey,
  filters,
  pagination: controlledPagination,
  onPaginationChange,
  pageCount,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  globalFilterFn,
  enableRowSelection = false,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  sorting: controlledSorting,
  onSortingChange,
  showToolbar = true,
  showPagination = true,
  emptyMessage = 'No results.',
  className,
  isLoading = false,
  ensurePageInRange,
  instanceId,
}: DataTableProps<TData, TValue>) {
  const { table, rows, hasRows, paginationKey, isFiltered, currentPagination } = useDataTableState({
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
    enableRowSelection,
    ensurePageInRange,
  });

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom on mobile when toolbar is visible
        'flex flex-1 flex-col gap-4',
        className
      )}
    >
      {showToolbar && (
        <DataTableToolbar
          instanceId={instanceId}
          table={table}
          searchPlaceholder={searchPlaceholder}
          searchKey={searchKey}
          filters={filters}
          isFiltered={isFiltered}
        />
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(header.column.columnDef.meta?.className, header.column.columnDef.meta?.thClassName)}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="min-h-[400px]">
            {isLoading ? (
              // 스켈레톤 로딩 UI
              Array.from({ length: currentPagination.pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-${index}-${colIndex}`} className={cn(column.meta?.className, column.meta?.tdClassName)}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : hasRows ? (
              rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.className, cell.column.columnDef.meta?.tdClassName)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[400px] text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination key={paginationKey} table={table} className="mt-auto" />}
    </div>
  );
}

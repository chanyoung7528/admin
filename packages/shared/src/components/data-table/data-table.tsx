import { cn } from '@shared/lib/utils';
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
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';

// Custom meta type extension
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string;
    thClassName?: string;
    tdClassName?: string;
  }
}

interface DataTableProps<TData, TValue> {
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
  globalFilterFn?: (row: any, columnId: string, filterValue: any) => boolean;
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
  // Callbacks
  ensurePageInRange?: (pageCount: number) => void;
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
  ensurePageInRange,
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: controlledSorting ?? localSorting,
      columnVisibility: controlledColumnVisibility ?? localColumnVisibility,
      rowSelection: controlledRowSelection ?? localRowSelection,
      columnFilters: controlledColumnFilters ?? localColumnFilters,
      globalFilter: controlledGlobalFilter ?? localGlobalFilter,
      pagination: controlledPagination ?? localPagination,
    },
    pageCount: pageCount,
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

  const tablePageCount = table.getPageCount();

  useEffect(() => {
    if (ensurePageInRange) {
      ensurePageInRange(tablePageCount);
    }
  }, [tablePageCount, ensurePageInRange]);

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom on mobile when toolbar is visible
        'flex flex-1 flex-col gap-4',
        className
      )}
    >
      {showToolbar && <DataTableToolbar table={table} searchPlaceholder={searchPlaceholder} searchKey={searchKey} filters={filters} />}
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} className="mt-auto" />}
    </div>
  );
}

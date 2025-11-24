import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';

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
  // UI
  showToolbar?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
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
  showToolbar = true,
  showPagination = true,
  emptyMessage = 'No results.',
}: DataTableProps<TData, TValue>) {
  // Local state (uncontrolled mode)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>([]);
  const [localGlobalFilter, setLocalGlobalFilter] = useState('');
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters: controlledColumnFilters ?? localColumnFilters,
      globalFilter: controlledGlobalFilter ?? localGlobalFilter,
      pagination: controlledPagination ?? localPagination,
    },
    pageCount: pageCount,
    manualPagination: !!onPaginationChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setLocalColumnFilters,
    onGlobalFilterChange: onGlobalFilterChange ?? setLocalGlobalFilter,
    onPaginationChange: onPaginationChange ?? setLocalPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      {showToolbar && <DataTableToolbar table={table} searchPlaceholder={searchPlaceholder} searchKey={searchKey} filters={filters} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}

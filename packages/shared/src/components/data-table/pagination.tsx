import { cn } from '@shared/lib/utils';
import { Button } from '@shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { type Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { usePaginationState } from './hooks';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  className?: string;
};

export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const {
    pageSize,
    currentPage,
    totalPages,
    isPageCountValid,
    pageNumbers,
    canPreviousPage,
    canNextPage,
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    handlePageSizeChange,
    handlePageClick,
  } = usePaginationState({ table });

  return (
    <div
      className={cn('flex items-center justify-between overflow-clip px-2', '@max-2xl/content:flex-col-reverse @max-2xl/content:gap-4', className)}
      style={{ overflowClipMargin: 1 }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium @2xl/content:hidden">
          {isPageCountValid ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}
        </div>
        <div className="flex items-center gap-2 @max-2xl/content:flex-row-reverse">
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(pSize => (
                <SelectItem key={pSize} value={`${pSize}`}>
                  {pSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
        </div>
      </div>

      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium @max-3xl/content:hidden">
          {isPageCountValid ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="size-8 p-0 @max-md/content:hidden" onClick={handleFirstPage} disabled={!canPreviousPage || !isPageCountValid}>
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="size-8 p-0" onClick={handlePreviousPage} disabled={!canPreviousPage || !isPageCountValid}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          {isPageCountValid &&
            pageNumbers.map((pageNumber, index) => (
              <div key={`${pageNumber}-${index}`} className="flex items-center">
                {pageNumber === '...' ? (
                  <span className="text-muted-foreground px-1 text-sm">...</span>
                ) : (
                  <Button
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    className="h-8 min-w-8 px-2"
                    onClick={() => handlePageClick(pageNumber as number)}
                  >
                    <span className="sr-only">Go to page {pageNumber}</span>
                    {pageNumber}
                  </Button>
                )}
              </div>
            ))}

          <Button variant="outline" className="size-8 p-0" onClick={handleNextPage} disabled={!canNextPage || !isPageCountValid}>
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="size-8 p-0 @max-md/content:hidden" onClick={handleLastPage} disabled={!canNextPage || !isPageCountValid}>
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

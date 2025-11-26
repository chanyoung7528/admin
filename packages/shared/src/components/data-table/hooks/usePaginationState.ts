import { getPageNumbers } from '@shared/lib/utils';
import { type Table } from '@tanstack/react-table';
import { useMemo } from 'react';

interface UsePaginationStateProps<TData> {
  table: Table<TData>;
}

export function usePaginationState<TData>({ table }: UsePaginationStateProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = table.getPageCount();

  // 현재 페이지 번호 (1-based)
  const currentPage = useMemo(() => {
    return pageIndex + 1;
  }, [pageIndex]);

  // 페이지 수가 유효한지 확인
  const isPageCountValid = useMemo(() => {
    return totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
  }, [totalPages]);

  // 페이지 번호 배열 계산
  const pageNumbers = useMemo(() => {
    return isPageCountValid ? getPageNumbers(currentPage, totalPages) : [];
  }, [isPageCountValid, currentPage, totalPages]);

  // 네비게이션 핸들러
  const handleFirstPage = () => {
    table.setPageIndex(0);
  };

  const handleLastPage = () => {
    if (isPageCountValid) {
      table.setPageIndex(totalPages - 1);
    }
  };

  const handlePreviousPage = () => {
    table.previousPage();
  };

  const handleNextPage = () => {
    table.nextPage();
  };

  const handlePageSizeChange = (value: string) => {
    table.setPageSize(Number(value));
  };

  const handlePageClick = (pageNumber: number) => {
    table.setPageIndex(pageNumber - 1);
  };

  return {
    pageIndex,
    pageSize,
    totalPages,
    currentPage,
    isPageCountValid,
    pageNumbers,
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    handlePageSizeChange,
    handlePageClick,
  };
}

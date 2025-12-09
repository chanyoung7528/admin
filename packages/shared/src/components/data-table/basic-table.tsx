import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

/**
 * BasicTable 컬럼 정의
 */
export interface BasicTableColumn<T> {
  /** 컬럼의 고유 키 */
  key: string;
  /** 컬럼 헤더에 표시될 제목 */
  header: string;
  /** 셀 내용을 렌더링하는 함수 */
  cell?: (row: T, index: number) => ReactNode;
  /** 데이터 객체에서 접근할 필드명 (cell이 없을 때 사용) */
  accessor?: keyof T;
  /** 헤더 정렬 (기본값: left) */
  headerAlign?: 'left' | 'center' | 'right';
  /** 셀 정렬 (기본값: left) */
  cellAlign?: 'left' | 'center' | 'right';
  /** 컬럼 너비 */
  width?: string;
  /** 헤더 커스텀 클래스 */
  headerClassName?: string;
  /** 셀 커스텀 클래스 */
  cellClassName?: string;
}

/**
 * BasicTable Props
 */
export interface BasicTableProps<T> {
  /** 테이블에 표시할 데이터 배열 */
  data: T[];
  /** 컬럼 정의 배열 */
  columns: BasicTableColumn<T>[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 데이터가 없을 때 표시할 메시지 */
  emptyMessage?: string;
  /** 로딩 중 표시할 메시지 */
  loadingMessage?: string;
  /** 각 행의 고유 키를 생성하는 함수 */
  getRowKey?: (row: T, index: number) => string | number;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: T, index: number) => void;
  /** 테이블 컨테이너 커스텀 클래스 */
  className?: string;
  /** 로딩 스켈레톤 행 개수 (기본값: 5) */
  skeletonRows?: number;
}

/**
 * 정렬 클래스를 반환하는 헬퍼 함수
 */
function getAlignClass(align?: 'left' | 'center' | 'right'): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

/**
 * BasicTable - 간단한 리스트 표시용 재사용 가능한 테이블 컴포넌트
 *
 * @example
 * ```tsx
 * const columns: BasicTableColumn<Order>[] = [
 *   {
 *     key: 'id',
 *     header: '주문번호',
 *     accessor: 'id',
 *   },
 *   {
 *     key: 'amount',
 *     header: '주문금액',
 *     headerAlign: 'right',
 *     cellAlign: 'right',
 *     cell: (row) => `₩${row.amount.toLocaleString()}`,
 *   },
 * ];
 *
 * <BasicTable data={orders} columns={columns} />
 * ```
 */
export function BasicTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage: _loadingMessage = '로딩 중...',
  getRowKey,
  onRowClick,
  className,
  skeletonRows = 5,
}: BasicTableProps<T>) {
  // 기본 행 키 생성 함수
  const defaultGetRowKey = (row: T, index: number) => {
    if (getRowKey) {
      return getRowKey(row, index);
    }
    // row에 id 또는 _id 속성이 있으면 사용, 없으면 index 사용
    if (typeof row === 'object' && row !== null) {
      const rowObj = row as Record<string, unknown>;
      if ('id' in rowObj) return String(rowObj.id);
      if ('_id' in rowObj) return String(rowObj._id);
    }
    return index;
  };

  // 로딩 스켈레톤 렌더링
  if (isLoading) {
    return (
      <div className={cn('overflow-hidden rounded-lg border', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key} className={cn(getAlignClass(column.headerAlign), column.headerClassName)} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(column => (
                  <TableCell key={column.key} className={column.cellClassName}>
                    <div className="bg-muted h-4 w-full animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // 빈 데이터 렌더링
  if (!data || data.length === 0) {
    return (
      <div className={cn('overflow-hidden rounded-lg border', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column.key} className={cn(getAlignClass(column.headerAlign), column.headerClassName)} style={{ width: column.width }}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  // 데이터 테이블 렌더링
  return (
    <div className={cn('overflow-hidden rounded-lg border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.key} className={cn(getAlignClass(column.headerAlign), column.headerClassName)} style={{ width: column.width }}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={defaultGetRowKey(row, rowIndex)} onClick={() => onRowClick?.(row, rowIndex)} className={cn(onRowClick && 'cursor-pointer')}>
              {columns.map(column => {
                // cell 함수가 있으면 사용, 없으면 accessor로 직접 접근
                const cellContent = column.cell ? column.cell(row, rowIndex) : column.accessor ? String(row[column.accessor]) : null;

                return (
                  <TableCell key={column.key} className={cn(getAlignClass(column.cellAlign), column.cellClassName)}>
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

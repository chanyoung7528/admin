import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface PageBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageBody - 페이지 본문 카드 컴포넌트
 * 일관된 배경, 테두리, 그림자, 간격을 제공합니다.
 */
export function PageBody({ children, className }: PageBodyProps) {
  return <div className={cn('bg-card flex flex-col gap-6 rounded-lg border p-6 shadow-sm', className)}>{children}</div>;
}

import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer - 페이지 메인 컨텐츠 래퍼
 * 일관된 padding과 spacing을 제공합니다.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('flex flex-col gap-6 p-6', className)}>{children}</div>;
}

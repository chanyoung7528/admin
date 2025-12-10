import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * ContentWrapper - 페이지 메인 컨텐츠 래퍼
 * 일관된 padding과 spacing을 제공합니다.
 */
export function ContentWrapper({ children, className }: ContentWrapperProps) {
  return <div className={cn('flex flex-col gap-6 p-6', className)}>{children}</div>;
}

import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface ContentWrapProps {
  children: ReactNode;
  className?: string;
}

/**
 * ContentWrap - 페이지 본문 카드 컴포넌트
 * 일관된 배경, 테두리, 그림자, 간격을 제공합니다.
 */
export function ContentWrap({ children, className }: ContentWrapProps) {
  return <div className={cn('bg-card flex flex-col gap-5', className)}>{children}</div>;
}

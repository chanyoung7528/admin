import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface StatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * StatsGrid - StatsCard를 그리드 레이아웃으로 배치하는 컨테이너
 * @param children - StatsCard 컴포넌트들
 * @param columns - 그리드 컬럼 수 (기본값: 4)
 * @param className - 추가 스타일
 */
export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={cn('grid gap-4', gridCols[columns], className)}>{children}</div>;
}

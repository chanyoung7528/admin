import { cn } from '@shared/lib/utils';
import type { ReactNode } from 'react';

interface WidgetCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  headerAction?: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * WidgetCard - 대시보드 위젯용 카드 컨테이너
 * @param children - 카드 내용
 * @param title - 카드 제목
 * @param description - 카드 설명
 * @param headerAction - 헤더 우측 액션 영역
 * @param padding - 패딩 크기 (sm, md, lg)
 * @param className - 추가 스타일
 */
export function WidgetCard({ children, title, description, headerAction, padding = 'md', className }: WidgetCardProps) {
  const showHeader = title || description || headerAction;

  return (
    <div className={cn('bg-card rounded-xl border shadow-sm', paddingVariants[padding], className)}>
      {showHeader && (
        <div className="mb-6 flex items-start justify-between">
          {(title || description) && (
            <div className="flex flex-col gap-1">
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
          )}
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

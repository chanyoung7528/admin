import { cn } from '@shared/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 * 데이터가 없을 때 표시하는 컴포넌트
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center', className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

import { cn } from '@shared/lib/utils';
import type { ComponentType, ReactNode } from 'react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  iconElement?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  trend?: {
    value: number;
    label: string;
  };
  isLoading?: boolean;
}

const variantStyles = {
  default: {
    container: 'bg-background border',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
  success: {
    container: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    icon: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    value: 'text-green-700 dark:text-green-300',
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
    icon: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
    value: 'text-yellow-700 dark:text-yellow-300',
  },
  danger: {
    container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    icon: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    value: 'text-red-700 dark:text-red-300',
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    icon: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    value: 'text-blue-700 dark:text-blue-300',
  },
};

/**
 * StatsCard - 통계 정보를 표시하는 카드 컴포넌트
 * @param title - 카드 제목
 * @param value - 표시할 값
 * @param description - 부가 설명
 * @param icon - 아이콘 컴포넌트 (예: Lucide Icon)
 * @param iconElement - 아이콘 ReactNode (icon 대신 사용)
 * @param variant - 카드 색상 테마
 * @param trend - 추세 정보 (선택사항)
 * @param isLoading - 로딩 상태
 */
export function StatsCard({ title, value, description, icon: Icon, iconElement, variant = 'default', trend, isLoading = false }: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('rounded-lg p-4 shadow-sm transition-shadow hover:shadow-md', styles.container)}>
      <div className="flex items-center justify-between">
        <p className="text-foreground/80 text-sm font-medium">{title}</p>
        {(Icon || iconElement) && <div className={cn('rounded-full p-2', styles.icon)}>{Icon ? <Icon className="h-4 w-4" /> : iconElement}</div>}
      </div>

      <div className="mt-3">
        <p className={cn('text-2xl font-bold', styles.value)}>{isLoading ? '...' : value}</p>

        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
            {trend && (
              <span className={cn('text-xs font-medium', trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                {trend.value >= 0 ? '+' : ''}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

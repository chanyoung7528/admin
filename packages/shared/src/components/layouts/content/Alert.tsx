import { cn } from '@shared/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
  className?: string;
}

const variantConfig = {
  default: {
    container: 'border-border bg-background',
    icon: 'text-foreground',
    title: 'text-foreground',
    defaultIcon: Info,
  },
  success: {
    container: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    defaultIcon: CheckCircle,
  },
  warning: {
    container: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    defaultIcon: AlertCircle,
  },
  error: {
    container: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    defaultIcon: XCircle,
  },
  info: {
    container: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    defaultIcon: Info,
  },
};

/**
 * Alert - 범용 알림 컴포넌트
 * @param variant - 알림 타입 (default, success, warning, error, info)
 * @param title - 알림 제목
 * @param description - 알림 설명
 * @param icon - 커스텀 아이콘 컴포넌트
 * @param children - 추가 콘텐츠
 * @param className - 추가 스타일
 */
export function Alert({ variant = 'default', title, description, icon: CustomIcon, children, className }: AlertProps) {
  const config = variantConfig[variant];
  const IconComponent = CustomIcon || config.defaultIcon;

  return (
    <div className={cn('mb-4 rounded-lg border p-4', config.container, className)}>
      <div className="flex items-start gap-3">
        <IconComponent className={cn('h-5 w-5 flex-shrink-0', config.icon)} />
        <div className="flex-1">
          <p className={cn('text-sm font-medium', config.title)}>{title}</p>
          {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
}

/**
 * @deprecated ErrorAlert는 Alert 컴포넌트로 대체됩니다. Alert를 variant="error"로 사용하세요.
 */
export function ErrorAlert({ title, description }: { title: string; description?: string }) {
  return <Alert variant="error" title={title} description={description} />;
}

import { cn } from '@shared/lib/utils';
import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type ErrorVariant = 'error' | 'warning' | 'info' | 'destructive';

interface FormErrorProps {
  title?: string;
  message?: string | ReactNode;
  errors?: Record<string, string | undefined>;
  variant?: ErrorVariant;
  className?: string;
}

const variantConfig = {
  error: {
    icon: AlertCircle,
    container: 'border-red-200 bg-red-50',
    title: 'text-red-800',
    message: 'text-red-700',
    list: 'text-red-700',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    container: 'border-yellow-200 bg-yellow-50',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    list: 'text-yellow-700',
    iconColor: 'text-yellow-500',
  },
  info: {
    icon: Info,
    container: 'border-blue-200 bg-blue-50',
    title: 'text-blue-800',
    message: 'text-blue-700',
    list: 'text-blue-700',
    iconColor: 'text-blue-500',
  },
  destructive: {
    icon: XCircle,
    container: 'border-destructive/50 bg-destructive/5',
    title: 'text-destructive',
    message: 'text-destructive/90',
    list: 'text-destructive/90',
    iconColor: 'text-destructive',
  },
} as const;

export function FormError({ title = '입력 오류', message, errors, variant = 'error', className }: FormErrorProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const hasErrors = errors && Object.keys(errors).length > 0;

  if (!message && !hasErrors) return null;

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', config.container, className)}>
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconColor)} />
      <div className="flex-1 space-y-2">
        {title && <h3 className={cn('font-semibold', config.title)}>{title}</h3>}
        {message && <div className={cn('text-sm', config.message)}>{message}</div>}
        {hasErrors && (
          <ul className={cn('list-inside list-disc space-y-1 text-sm', config.list)}>
            {Object.entries(errors).map(
              ([key, error]) =>
                error && (
                  <li key={key}>
                    <span className="font-medium">{key}:</span> {error}
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

// Inline error (필드 바로 아래 표시용)
interface FormFieldErrorProps {
  message?: string;
  className?: string;
}

export function FormFieldError({ message, className }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <div className={cn('mt-1.5 flex items-start gap-1.5', className)}>
      <AlertCircle className="text-destructive mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p className="text-destructive text-xs leading-tight">{message}</p>
    </div>
  );
}

import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  title: string;
  description?: string;
}

/**
 * ErrorAlert - 에러 메시지를 표시하는 알림 컴포넌트
 * @param title - 에러 제목
 * @param description - 에러 설명 (선택사항)
 */
export function ErrorAlert({ title, description }: ErrorAlertProps) {
  return (
    <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <div>
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{title}</p>
          {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
        </div>
      </div>
    </div>
  );
}

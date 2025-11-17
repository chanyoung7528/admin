import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, useErrorBoundary, type ErrorBoundaryPropsWithComponent, type FallbackProps } from 'react-error-boundary';
import { Button } from './button';

interface ErrorFallbackProps extends FallbackProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

/**
 * 기본 에러 폴백 UI 컴포넌트
 * 에러 발생 시 사용자에게 표시되는 기본 화면
 */
export function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  title = '문제가 발생했습니다',
  description = '예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.',
  showHomeButton = false,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground max-w-md text-sm">{description}</p>
        </div>
      </div>

      {error && (
        <details className="bg-muted/50 w-full max-w-2xl rounded-lg border p-4">
          <summary className="cursor-pointer text-sm font-medium">에러 상세 정보</summary>
          <div className="mt-4 space-y-2">
            <div className="bg-background rounded-md p-3">
              <p className="text-destructive font-mono text-sm">{error.message}</p>
            </div>
            {error.stack && (
              <div className="bg-background rounded-md p-3">
                <pre className="max-h-48 overflow-auto font-mono text-xs whitespace-pre-wrap">{error.stack}</pre>
              </div>
            )}
          </div>
        </details>
      )}

      <div className="flex gap-3">
        <Button onClick={resetErrorBoundary} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          다시 시도
        </Button>
        {showHomeButton && (
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 심플한 에러 폴백 UI (인라인 표시용)
 */
export function SimpleErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center gap-4 rounded-lg border p-6">
      <div className="text-destructive flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">오류가 발생했습니다</p>
      </div>
      {error && <p className="text-muted-foreground max-w-md text-center text-xs">{error.message}</p>}
      <Button onClick={resetErrorBoundary} size="sm" variant="outline">
        다시 시도
      </Button>
    </div>
  );
}

/**
 * 최소한의 에러 폴백 UI
 */
export function MinimalErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="text-destructive flex items-center gap-2 text-sm">
      <AlertTriangle className="h-4 w-4" />
      <span>오류 발생</span>
      <Button onClick={resetErrorBoundary} size="sm" variant="ghost">
        재시도
      </Button>
    </div>
  );
}

/**
 * 에러 바운더리 Props 타입
 */
export interface ErrorBoundaryProps extends Omit<ErrorBoundaryPropsWithComponent, 'FallbackComponent' | 'fallback'> {
  children: ReactNode;
  fallback?: 'default' | 'simple' | 'minimal' | React.ComponentType<FallbackProps>;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
}

export function ErrorBoundary({ children, fallback = 'default', title, description, showHomeButton = false, onError, onReset, ...props }: ErrorBoundaryProps) {
  const getFallbackComponent = () => {
    if (typeof fallback === 'function') {
      return fallback;
    }

    switch (fallback) {
      case 'simple':
        return SimpleErrorFallback;
      case 'minimal':
        return MinimalErrorFallback;
      case 'default':
      default:
        return (fallbackProps: FallbackProps) => (
          <DefaultErrorFallback {...fallbackProps} title={title} description={description} showHomeButton={showHomeButton} />
        );
    }
  };

  return (
    <ReactErrorBoundary FallbackComponent={getFallbackComponent()} onError={onError} onReset={onReset} {...props}>
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * 에러 핸들러 훅
 * 이벤트 핸들러나 비동기 함수에서 발생한 에러를 ErrorBoundary로 전달
 *
 * @example
 * ```tsx
 * const handleError = useErrorHandler();
 *
 * const fetchData = async () => {
 *   try {
 *     await someAsyncOperation();
 *   } catch (error) {
 *     handleError(error);
 *   }
 * };
 * ```
 */
export function useErrorHandler() {
  const { showBoundary } = useErrorBoundary();
  return showBoundary;
}

// re-export useful types
export type { FallbackProps };

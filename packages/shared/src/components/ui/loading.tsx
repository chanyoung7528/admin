import { cn } from '@shared/lib/utils';

/**
 * 로딩 스피너 컴포넌트
 */
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return <div className={cn('border-muted border-t-primary animate-spin rounded-full border-2', sizes[size], className)} />;
}

/**
 * 로딩 오버레이 컴포넌트
 */
export function LoadingOverlay({ message = '로딩 중...', className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex min-h-[200px] flex-col items-center justify-center gap-4', className)}>
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

/**
 * 전역 페이지 로딩 컴포넌트
 */
export function LoadingPageOverlay() {
  return (
    <div className={'bg-primary/50 fixed top-0 right-0 bottom-0 left-0 z-999 flex items-center justify-center'}>
      <LoadingSpinner size="lg" />
    </div>
  );
}

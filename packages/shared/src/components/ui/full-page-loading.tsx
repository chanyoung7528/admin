import { Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useFullPageLoadingStore } from '../../hooks/useFullPageLoadingStore';

export function FullPageLoading() {
  const isVisible = useFullPageLoadingStore(state => state.isVisible);

  if (!isVisible || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="bg-background/40 pointer-events-none fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-card ring-border pointer-events-auto rounded-full px-6 py-4 shadow-lg ring-1">
        <div className="text-foreground flex items-center space-x-3 text-sm font-medium">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

import { cn } from '@shared/lib/utils';

import type { TreeActionsProps } from './types';

export const TreeActions = ({ children }: TreeActionsProps) => {
  return <div className={cn('ml-auto')}>{children}</div>;
};

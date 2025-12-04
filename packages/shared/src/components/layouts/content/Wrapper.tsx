import type { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  return <div className="flex flex-col gap-4 p-4">{children}</div>;
}

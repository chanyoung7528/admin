import type { ReactNode } from 'react';

interface ContentHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function ContentHeader({ title, description, children }: ContentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

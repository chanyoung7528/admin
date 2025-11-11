import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@repo/shared/lib/utils';

type TabsVariant = 'default' | 'underline';

const TabsContext = React.createContext<{ variant: TabsVariant }>({
  variant: 'default',
});

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
}) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          'inline-flex items-center justify-center',
          variant === 'default' && 'bg-muted text-muted-foreground h-9 w-fit rounded-lg p-[3px]',
          variant === 'underline' && 'border-border w-full border-b',
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { variant } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === 'default' &&
          'data-[state=active]:bg-background data-[state=active]:text-foreground h-[calc(100%-6px)] flex-1 rounded-md border border-transparent px-3 py-1.5 data-[state=active]:shadow-sm',
        variant === 'underline' && 'data-[state=active]:border-primary data-[state=active]:text-foreground border-b-2 border-transparent px-3 py-2',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

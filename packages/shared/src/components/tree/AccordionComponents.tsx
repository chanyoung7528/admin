import { cn } from '@shared/lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import React from 'react';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isExpanded?: boolean;
  }
>(({ className, children, isExpanded, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger ref={ref} className={cn('flex w-full flex-1 items-center transition-all', className)} {...props}>
      {/* Expand/Collapse 인디케이터 */}
      <div className="mr-1 flex h-4 w-4 shrink-0 items-center justify-center">
        {isExpanded ? (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-neutral-500 dark:text-neutral-400">
            <rect x="0" y="3" width="8" height="2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-neutral-500 dark:text-neutral-400">
            <rect x="0" y="3" width="8" height="2" fill="currentColor" />
            <rect x="3" y="0" width="2" height="8" fill="currentColor" />
          </svg>
        )}
      </div>
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn('data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all', className)}
    {...props}
  >
    <div>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

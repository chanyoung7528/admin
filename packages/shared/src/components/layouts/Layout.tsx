import { LayoutProvider } from '@shared/components/context/LayoutProvider';
import { cn } from '@shared/lib/utils';
import { SidebarInset, SidebarProvider } from '@shared/ui/sidebar';
import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from './sidebar/AppSidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            '@container/content',

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            'has-data-[layout=fixed]:h-svh',

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          {children ?? <Outlet />}
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}

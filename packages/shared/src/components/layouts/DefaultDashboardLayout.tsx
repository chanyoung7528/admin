import { LayoutProvider } from "@repo/shared/components/context/LayoutProvider";
import { DefaultHeader } from "./DefaultHeader";
import { SidebarProvider } from "@repo/shared/components/ui/sidebar";

export function DefaultDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <SidebarProvider>
        <DefaultHeader />
        {children}
      </SidebarProvider>
    </LayoutProvider>
  );
}

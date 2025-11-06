import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DefaultDashboardLayout } from "@repo/shared/components/layouts/DefaultDashboardLayout";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <DefaultDashboardLayout>
      <Outlet />

      {import.meta.env.MODE === "development" && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </DefaultDashboardLayout>
  );
}

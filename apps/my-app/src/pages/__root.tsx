import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { DefaultDashboardLayout } from "@repo/shared/components/layouts/DefaultDashboardLayout";
import { lazy, Suspense } from "react";

// 개발 도구는 동적 임포트 (프로덕션 빌드에서 제외)
const TanStackRouterDevtools =
  import.meta.env.MODE === "development"
    ? lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )
    : () => null;

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <DefaultDashboardLayout>
      <Outlet />

      {import.meta.env.MODE === "development" && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      )}
    </DefaultDashboardLayout>
  );
}

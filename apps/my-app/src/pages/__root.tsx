import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext()({
  component: () => {
    return (
      <>
        <Outlet />

        {import.meta.env.MODE === "development" && (
          <>
            <TanStackRouterDevtools position="bottom-right" />
          </>
        )}
      </>
    );
  },
});

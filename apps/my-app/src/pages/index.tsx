import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../domains/dashboard";
import { DefaultDashboardLayout } from "@repo/shared/components/layouts/DefaultDashboardLayout";

export const Route = createFileRoute("/")({
  component: () => {
    return (
      <DefaultDashboardLayout>
        <Dashboard />
      </DefaultDashboardLayout>
    );
  },
});

import { createFileRoute } from '@tanstack/react-router';

import { SettlementTable } from '@/domains/settlement/components';

export const Route = createFileRoute('/_authenticated/settlement/list')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettlementTable service="FOOD" />;
}

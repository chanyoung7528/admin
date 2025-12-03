import { createFileRoute } from '@tanstack/react-router';

import { SettlementView } from '@/domains/settlement/components/SettlementView';

export const Route = createFileRoute('/_authenticated/settlement/view')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettlementView />;
}

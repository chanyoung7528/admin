import { createFileRoute } from '@tanstack/react-router';

import { SettlementList } from '@/domains/settlement/components/SettlementList';

export const Route = createFileRoute('/_authenticated/settlement/basic-table')({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettlementList />;
}

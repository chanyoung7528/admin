import { createFileRoute } from '@tanstack/react-router';
import { SettlementTable } from '@/domains/settlement/components';

export const Route = createFileRoute('/_authenticated/my-mind/settlement')({
  component: MindSettlementPage,
});

function MindSettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND B2B 정산 관리</h1>
        <p className="text-muted-foreground">MY MIND 서비스 B2B 정산 내역</p>
      </div>

      <SettlementTable service="MIND" />
    </div>
  );
}

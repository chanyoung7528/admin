import { SettlementTable } from '@/domains/settlement/components';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

// Search params 스키마 정의
const settlementSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  status: z.array(z.string()).catch([]),
  filter: z.string().catch(''),
});

export const Route = createFileRoute('/_authenticated/my-body/settlement')({
  component: BodySettlementPage,
  validateSearch: settlementSearchSchema,
});

function BodySettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 정산 관리</h1>
        <p className="text-muted-foreground">MY BODY 서비스 결제 및 정산 내역</p>
      </div>

      <SettlementTable service="BODY" />
    </div>
  );
}

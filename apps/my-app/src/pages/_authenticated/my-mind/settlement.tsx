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

export const Route = createFileRoute('/_authenticated/my-mind/settlement')({
  component: MindSettlementPage,
  validateSearch: settlementSearchSchema,
});

function MindSettlementPage() {
  return (
    <div className="space-y-6 px-10">
      <div>
        <h1 className="text-3xl font-bold">MY MIND B2B 정산 관리</h1>
        <p className="text-muted-foreground">MY MIND 서비스 B2B 정산 내역</p>
      </div>

      <SettlementTable service="MIND" />
    </div>
  );
}

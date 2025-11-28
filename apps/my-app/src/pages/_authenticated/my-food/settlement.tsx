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

export const Route = createFileRoute('/_authenticated/my-food/settlement')({
  component: FoodSettlementPage,
  validateSearch: settlementSearchSchema,
});

function FoodSettlementPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD B2B 정산 관리</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 서비스 B2B 정산 내역</p>
      </div>

      <SettlementTable service="FOOD" />
    </div>
  );
}

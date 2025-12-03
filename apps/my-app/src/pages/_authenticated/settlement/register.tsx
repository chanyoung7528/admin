import { createFileRoute } from '@tanstack/react-router';

import { SettlementForm } from '@/domains/settlement/components/SettlementForm';

export const Route = createFileRoute('/_authenticated/settlement/register')({
  component: SettlementRegisterPage,
});

function SettlementRegisterPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD 정산 등록</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 폼 관리 - Table 기반 재사용 컴포넌트 예제</p>
      </div>

      <SettlementForm onSubmit={() => {}} />
    </div>
  );
}

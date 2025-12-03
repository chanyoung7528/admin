import { createFileRoute } from '@tanstack/react-router';

import { SettlementForm } from '@/domains/settlement/components/SettlementForm';
import type { SettlementFormSchema } from '@/domains/settlement/schemas';

export const Route = createFileRoute('/_authenticated/my-food/form')({
  component: RouteComponent,
});

function RouteComponent() {
  const handleSubmit = (data: SettlementFormSchema) => {
    console.log('폼 제출:', data);
    alert('폼이 제출되었습니다. 콘솔을 확인하세요.');
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD 폼</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 폼 관리 - Table 기반 재사용 컴포넌트 예제</p>
      </div>

      <SettlementForm onSubmit={handleSubmit} />
    </div>
  );
}

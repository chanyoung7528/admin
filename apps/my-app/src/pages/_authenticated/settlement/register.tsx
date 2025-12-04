import { PageContainer, PageHeader } from '@repo/shared/components/layouts/content';
import { Button } from '@repo/shared/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Upload } from 'lucide-react';

import { SettlementForm } from '@/domains/settlement/components/SettlementForm';

export const Route = createFileRoute('/_authenticated/settlement/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer>
      <PageHeader title="MY FOOD 정산 등록" description="MY FOOD 폼 관리 - Table 기반 재사용 컴포넌트 예제">
        <Button size="lg">
          <Upload className="h-4 w-4" />
          정산 엑셀 업로드
        </Button>
      </PageHeader>
      <SettlementForm onSubmit={() => {}} />
    </PageContainer>
  );
}

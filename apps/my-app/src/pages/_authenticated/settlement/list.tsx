import { PageContainer, PageHeader } from '@repo/shared/components/layouts/content';
import { Button } from '@repo/shared/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Download } from 'lucide-react';

import { SettlementTable } from '@/domains/settlement/components';

export const Route = createFileRoute('/_authenticated/settlement/list')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer>
      <PageHeader title="MY FOOD 정산 관리" description="서비스의 Site별 정산 내역을 관리하고 조회할 수 있습니다">
        <Button size="lg">
          <Download className="h-4 w-4" />
          정산 엑셀 다운로드
        </Button>
      </PageHeader>
      <SettlementTable service="FOOD" />
    </PageContainer>
  );
}

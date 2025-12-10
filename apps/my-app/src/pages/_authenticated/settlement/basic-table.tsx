import { ContentHeader, ContentWrap, ContentWrapper } from '@repo/shared/components/layouts/content';
import { Button } from '@repo/shared/components/ui';
import { createFileRoute } from '@tanstack/react-router';

import { SettlementList } from '@/domains/settlement/components/SettlementList';

export const Route = createFileRoute('/_authenticated/settlement/basic-table')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentWrapper>
      <ContentHeader title="주문/발주 내역" description="MY FOOD 제품 주문 및 배송 현황을 관리합니다">
        <Button size="lg">신규 주문 등록</Button>
      </ContentHeader>
      <ContentWrap>
        <SettlementList />
      </ContentWrap>
    </ContentWrapper>
  );
}

import { ContentHeader, ContentWrapper } from '@repo/shared/components/layouts/content';
import { createFileRoute } from '@tanstack/react-router';

import { SettlementView } from '@/domains/settlement/components/SettlementView';

export const Route = createFileRoute('/_authenticated/settlement/view')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentWrapper>
      <ContentHeader title="주문/발주 상세" description="MY FOOD 제품 주문 및 배송 현황을 관리합니다" />
      <SettlementView />
    </ContentWrapper>
  );
}

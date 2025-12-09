import { PageBody, StatsCard, StatsGrid } from '@repo/shared/components/layouts/content';
import { BasicTable } from '@repo/shared/components/ui';
import { CheckCircle, Clock, Package, ShoppingCart } from 'lucide-react';

import { settlementBasicColumns } from '../columns/settlementBasicColumns';
import { settlementsBasic } from '../services';

export function SettlementList() {
  return (
    <PageBody>
      <StatsGrid>
        <StatsCard title="총 주문" value="156건" icon={ShoppingCart} variant="default" />
        <StatsCard title="배송완료" value="142건" icon={CheckCircle} variant="success" />
        <StatsCard title="배송중" value="12건" icon={Package} variant="info" />
        <StatsCard title="주문확인" value="2건" icon={Clock} variant="warning" />
      </StatsGrid>

      <BasicTable
        data={settlementsBasic}
        columns={settlementBasicColumns}
        emptyMessage="정산 내역이 없습니다."
        onRowClick={row => {
          console.log('정산 상세:', row);
        }}
      />
    </PageBody>
  );
}

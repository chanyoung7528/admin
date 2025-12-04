import { BasicTable } from '@repo/shared/components/ui';

import { settlementBasicColumns } from '../columns/settlementBasicColumns';
import { settlementsBasic } from '../services';

export function SettlementList() {
  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
      {/* 주문 요약 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">총 주문</p>
          <p className="mt-1 text-2xl font-bold">156건</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
          <p className="text-sm text-green-700 dark:text-green-300">배송완료</p>
          <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">142건</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">배송중</p>
          <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">12건</p>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">주문확인</p>
          <p className="mt-1 text-2xl font-bold text-yellow-900 dark:text-yellow-100">2건</p>
        </div>
      </div>

      {/* 주문 테이블 - BasicTable 사용 */}
      <BasicTable
        data={settlementsBasic}
        columns={settlementBasicColumns}
        emptyMessage="정산 내역이 없습니다."
        onRowClick={row => {
          console.log('정산 상세:', row);
        }}
      />
    </div>
  );
}

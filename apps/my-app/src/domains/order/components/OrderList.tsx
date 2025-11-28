import { BasicTable } from '@repo/shared/components/ui';

import { orderColumns } from '../columns';
import type { Order } from '../types';

export function OrderList() {
  const orders: Order[] = [
    {
      id: 'ORD-2025-001',
      site: '강남 헬스케어',
      items: '프로틴 바 외 5건',
      amount: 450000,
      status: '배송완료',
      date: '2025-11-08',
    },
    {
      id: 'ORD-2025-002',
      site: '서초 웰니스',
      items: '건강식 도시락 외 3건',
      amount: 320000,
      status: '배송중',
      date: '2025-11-09',
    },
    {
      id: 'ORD-2025-003',
      site: '판교 케어센터',
      items: '샐러드 키트 외 8건',
      amount: 680000,
      status: '주문확인',
      date: '2025-11-10',
    },
  ];

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">주문/발주 내역</h2>
          <p className="text-muted-foreground mt-1 text-sm">MY FOOD 제품 주문 및 배송 현황을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">신규 주문 등록</button>
        </div>
      </div>

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
        data={orders}
        columns={orderColumns}
        emptyMessage="주문 내역이 없습니다."
        onRowClick={row => {
          console.log('주문 상세:', row);
        }}
      />
    </div>
  );
}

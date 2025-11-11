export function OrderList() {
  const orders = [
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
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">주문/발주 내역</h2>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">신규 주문 등록</button>
      </div>

      <p className="text-muted-foreground mb-6">MY FOOD 제품 주문 및 배송 현황을 관리합니다</p>

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

      {/* 주문 테이블 */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">주문번호</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Site명</th>
              <th className="px-4 py-3 text-left text-sm font-medium">품목</th>
              <th className="px-4 py-3 text-right text-sm font-medium">주문금액</th>
              <th className="px-4 py-3 text-left text-sm font-medium">주문일</th>
              <th className="px-4 py-3 text-center text-sm font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-muted/50 border-t">
                <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                <td className="px-4 py-3 text-sm">{order.site}</td>
                <td className="px-4 py-3 text-sm">{order.items}</td>
                <td className="px-4 py-3 text-right text-sm font-medium">₩{order.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{order.date}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      order.status === '배송완료'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === '배송중'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

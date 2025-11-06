import { useFoodOrdersQuery } from "../hooks";

export default function FoodOrderList() {
  const { data, isLoading } = useFoodOrdersQuery();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">발주 내역</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-2">
          {data && data.length > 0 ? (
            data.map((order: any, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-muted-foreground">
                    수량: {order.quantity} • {order.date}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${
                  order.status === "완료" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">발주 내역이 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}


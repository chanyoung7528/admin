import { useFoodStockQuery } from "../hooks";

export default function FoodStockTable() {
  const { data, isLoading } = useFoodStockQuery();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">재고 현황</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-2">
          {data && data.length > 0 ? (
            data.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">카테고리: {item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.quantity}개</p>
                  <p className={`text-sm ${
                    item.quantity < 10 ? "text-red-600" : "text-muted-foreground"
                  }`}>
                    {item.quantity < 10 ? "재고 부족" : "정상"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">재고 정보가 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}


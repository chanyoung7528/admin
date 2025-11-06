import { apiClient } from "@/core/api";

// 발주 내역 조회
export async function getFoodOrders() {
  // TODO: Implement API call
  return [
    { product: "샐러드A", quantity: 50, date: "2025-01-15", status: "완료" },
    { product: "샐러드B", quantity: 30, date: "2025-01-14", status: "진행중" },
  ];
}

// 재고 현황 조회
export async function getFoodStock() {
  // TODO: Implement API call
  return [
    { name: "샐러드A", category: "샐러드", quantity: 45 },
    { name: "샐러드B", category: "샐러드", quantity: 8 },
    { name: "음료A", category: "음료", quantity: 120 },
  ];
}

// 이용 현황 조회
export async function getFoodUsage() {
  // TODO: Implement API call
  return {
    totalOrders: 5678,
    stockCount: 234,
    revenue: "₩78,000,000",
  };
}


import { apiClient } from "@/core/api";

// 콘텐츠 이용 내역 조회
export async function getMindContent() {
  // TODO: Implement API call
  return [
    {
      title: "명상 가이드 #1",
      category: "명상",
      views: 1234,
      duration: 15,
    },
    {
      title: "스트레스 관리 팁",
      category: "심리",
      views: 987,
      duration: 10,
    },
  ];
}

// 계약 정보 조회
export async function getContractInfo() {
  // TODO: Implement API call
  return {
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "활성",
    monthlyFee: "₩500,000",
    totalUsage: 4567,
  };
}

// 이용 현황 조회
export async function getMindUsage() {
  // TODO: Implement API call
  return {
    totalViews: 4567,
    activeContracts: 89,
    revenue: "₩56,000,000",
  };
}


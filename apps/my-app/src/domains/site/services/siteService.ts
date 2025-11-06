import { apiClient } from "@/core/api";

// Site 목록 조회
export async function getSites() {
  // TODO: Implement API call
  return [
    { id: "1", name: "서울 본사", location: "서울시 강남구", status: "활성" },
    { id: "2", name: "판교 지점", location: "경기도 성남시", status: "활성" },
    { id: "3", name: "부산 지점", location: "부산시 해운대구", status: "활성" },
  ];
}

// Site 상세 정보 조회
export async function getSiteDetail(siteId: string) {
  // TODO: Implement API call
  return {
    id: siteId,
    name: "서울 본사",
    location: "서울시 강남구",
    status: "활성",
    devices: 15,
    users: 234,
  };
}


import { type Settlement, type SettlementBasic } from '../types';

export interface GetSettlementsParams {
  page?: number;
  pageSize?: number;
  status?: string[];
  service?: 'BODY' | 'FOOD' | 'MIND';
  filter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 하드코딩된 정산 데이터 (1000개)
const settlements: Settlement[] = Array.from({ length: 1000 }, (_, index) => {
  const sites = [
    '강남 헬스케어',
    '서초 웰니스',
    '판교 케어센터',
    '삼성 메디컬',
    '역삼 웰빙센터',
    '신사 클리닉',
    '압구정 센터',
    '청담 헬스',
    '도곡 웰니스',
    '대치 메디컬',
    '여의도 건강센터',
    '광화문 헬스케어',
    '마포 힐링팜',
    '잠실 피트니스',
    '논현 리커버리',
    '수원 메디웰',
    '분당 하트케어',
    '동작 밸런스',
    '구로 메디업',
    '시청 웰메디',
    '선릉 리셋센터',
    '목동 케어힐',
    '건대 코어웰',
    '삼성 메디라운지',
    '부산 해운대 클리닉',
    '광주 피트케어',
    '대전 뉴라이프',
    '울산 메디밸런스',
    '일산 프라임케어',
    '인천 센터힐',
  ];

  const statuses: Settlement['status'][] = ['completed', 'pending'];
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];

  return {
    id: `ST-${index + 1}`,
    site: sites[index % sites.length]!,
    amount: 2000000 + ((index * 6000) % 6000000),
    period: months[index % months.length]!,
    status: statuses[index % statuses.length]!,
    date: `2025-${String((Math.floor(index / 31) % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
  };
});

export const settlementsBasic: SettlementBasic[] = [
  { id: 'ORD-2025-001', customer: '강남 헬스케어', items: '프로틴 바 외 5건', amount: 450000, status: 'completed', date: '2025-11-08' },
  { id: 'ORD-2025-002', customer: '서초 웰니스', items: '건강식 도시락 외 3건', amount: 320000, status: 'processing', date: '2025-11-09' },
  { id: 'ORD-2025-003', customer: '판교 케어센터', items: '샐러드 키트 외 8건', amount: 680000, status: 'pending', date: '2025-11-10' },
  { id: 'ORD-2025-004', customer: '분당 피트니스', items: '프로틴 쉐이크 외 2건', amount: 280000, status: 'cancelled', date: '2025-11-11' },
];

export async function getSettlements(params?: GetSettlementsParams): Promise<{
  settlements: Settlement[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { page = 1, pageSize = 10, status, filter, sortBy, sortOrder = 'asc' } = params || {};

  let filteredData = [...settlements];

  if (status && status.length > 0) {
    filteredData = filteredData.filter(item => status.includes(item.status));
  }

  if (filter) {
    const searchLower = filter.toLowerCase();
    filteredData = filteredData.filter(item => item.id.toLowerCase().includes(searchLower) || item.site.toLowerCase().includes(searchLower));
  }

  // 정렬 적용
  if (sortBy) {
    filteredData.sort((a, b) => {
      // description은 정렬 대상에서 제외
      if (sortBy === 'description') return 0;

      const aValue = a[sortBy as keyof Omit<Settlement, 'description'>];
      const bValue = b[sortBy as keyof Omit<Settlement, 'description'>];

      // 문자열 또는 숫자 비교
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // 페이지네이션 적용
  const total = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 네트워크 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    settlements: paginatedData,
    total,
    page,
    pageSize,
  };
}

export async function getSettlement(id: string): Promise<Settlement | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return settlements.find(s => s.id === id);
}

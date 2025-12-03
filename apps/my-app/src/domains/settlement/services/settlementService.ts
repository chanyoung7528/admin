import { faker } from '@faker-js/faker';

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

// Faker seed 고정으로 일관된 데이터 생성
faker.seed(12345);

// 확장된 30개 이상의 센터명(사이트) 추가
const extendedSites = [
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
  '노원 메디클럽',
  '동탄 헬스플러스',
  '천안 센트럴케어',
  '구리 힐링센터',
];

// 1000개의 Settlement 데이터 생성 (id는 faker uuid 사용으로 유니크하게!)
export const settlements = Array.from({ length: 1000 }, (_, index) => {
  const statuses: Settlement['status'][] = ['completed', 'pending'];
  return {
    id: `ST-${index + 1}`, // uuid 스타일로 최대한 중복 없이!
    site: faker.helpers.arrayElement(extendedSites),
    amount: faker.number.int({ min: 2000000, max: 8000000 }),
    period: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 7),
    status: faker.helpers.arrayElement(statuses),
    date: faker.date.between({ from: '2025-01-01', to: '2025-12-31' }).toISOString().slice(0, 10),
  } satisfies Settlement;
});

export const settlementsBasic: SettlementBasic[] = [
  { id: 'ORD-2025-001', customer: '강남 헬스케어', items: '프로틴 바 외 5건', amount: 450000, status: 'completed', date: '2025-11-08' },
  { id: 'ORD-2025-002', customer: '서초 웰니스', items: '건강식 도시락 외 3건', amount: 320000, status: 'processing', date: '2025-11-09' },
  { id: 'ORD-2025-003', customer: '판교 케어센터', items: '샐러드 키트 외 8건', amount: 680000, status: 'pending', date: '2025-11-10' },
  { id: 'ORD-2025-004', customer: '분당 피트니스', items: '프로틴 쉐이크 외 2건', amount: 280000, status: 'cancelled', date: '2025-11-11' },
];

/**
 * Settlement 목록 조회 (클라이언트 사이드 필터링)
 */
export async function getSettlements(params?: GetSettlementsParams): Promise<{
  settlements: Settlement[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { page = 1, pageSize = 10, status, filter, sortBy, sortOrder = 'asc' } = params || {};

  // 필터 적용
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

/**
 * Settlement 단일 조회
 */
export async function getSettlement(id: string): Promise<Settlement | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return settlements.find(s => s.id === id);
}

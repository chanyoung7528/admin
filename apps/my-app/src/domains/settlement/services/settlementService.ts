import { type Settlement } from '../types';

export interface GetSettlementsParams {
  page?: number;
  pageSize?: number;
  status?: string[];
  service?: 'BODY' | 'FOOD' | 'MIND';
  filter?: string;
}

export interface GetSettlementsParams {
  page?: number;
  pageSize?: number;
  status?: string[];
  service?: 'BODY' | 'FOOD' | 'MIND';
  filter?: string;
}

/**
 * Settlement 목록 조회 (JSON:API 형식)
 *
 * Note: 현재는 주석 처리 (apiClient 미구현)
 * JSON:API 형식 예시:
 * - https://jsonapi.org/
 * - GET /settlements?page[number]=1&page[size]=10&filter[status]=completed,pending
 * - Response: { data: [...], meta: { total, page, pageSize }, links: {...} }
 */

export async function getSettlements(_params?: GetSettlementsParams) {
  // TODO: apiClient 구현 후 활성화
  // const { page = 1, pageSize = 10, status, service, filter } = params || {};
  // const queryParams = new URLSearchParams();
  // queryParams.append('page[number]', page.toString());
  // queryParams.append('page[size]', pageSize.toString());
  // if (status && status.length > 0) queryParams.append('filter[status]', status.join(','));
  // if (service) queryParams.append('filter[service]', service);
  // if (filter) queryParams.append('filter[search]', filter);
  // const response = await apiClient.get<JsonApiResponse>(`/settlements?${queryParams.toString()}`);
  // return transformResponse(response.data);

  throw new Error('Not implemented - use getMockSettlements instead');
}

/**
 * Settlement 단일 조회 (JSON:API 형식)
 *
 * Note: 현재는 주석 처리 (apiClient 미구현)
 */
export async function getSettlement(_id: string) {
  // TODO: apiClient 구현 후 활성화
  throw new Error('Not implemented');
}

/**
 * Mock 데이터를 JSON:API 형식으로 반환 (개발/테스트용)
 */
export async function getMockSettlements(params?: GetSettlementsParams): Promise<{
  settlements: Settlement[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const { page = 1, pageSize = 10, status, filter } = params || {};

  // Mock 데이터
  let mockData: Settlement[] = [
    {
      id: 'ST-2025-001',
      site: '강남 헬스케어',
      amount: 3500000,
      period: '2025-10',
      status: 'completed',
      date: '2025-11-05',
    },
    {
      id: 'ST-2025-002',
      site: '서초 웰니스',
      amount: 2800000,
      period: '2025-10',
      status: 'pending',
      date: '2025-11-03',
    },
    {
      id: 'ST-2025-003',
      site: '판교 케어센터',
      amount: 4200000,
      period: '2025-10',
      status: 'completed',
      date: '2025-11-01',
    },
    {
      id: 'ST-2025-004',
      site: '삼성 메디컬',
      amount: 5100000,
      period: '2025-10',
      status: 'pending',
      date: '2025-11-07',
    },
    {
      id: 'ST-2025-005',
      site: '역삼 웰빙센터',
      amount: 3900000,
      period: '2025-10',
      status: 'completed',
      date: '2025-11-02',
    },
  ];

  // 필터 적용
  if (status && status.length > 0) {
    mockData = mockData.filter(item => status.includes(item.status));
  }

  if (filter) {
    const searchLower = filter.toLowerCase();
    mockData = mockData.filter(item => item.id.toLowerCase().includes(searchLower) || item.site.toLowerCase().includes(searchLower));
  }

  // 페이지네이션 적용
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockData.slice(startIndex, endIndex);

  return Promise.resolve({
    settlements: paginatedData,
    total: mockData.length,
    page,
    pageSize,
  });
}

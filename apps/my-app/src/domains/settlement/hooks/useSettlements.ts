import { useQuery } from '@tanstack/react-query';
import { getSettlements, type GetSettlementsParams } from '../services/settlementService';

export function useSettlements(params?: GetSettlementsParams) {
  // queryKey를 정규화하여 안정적인 캐시 키 생성
  const queryKey = [
    'settlements',
    {
      page: params?.page,
      pageSize: params?.pageSize,
      // 배열을 정렬하여 순서 무관하게 동일한 키 생성 (없으면 undefined)
      status: params?.status?.length ? [...params.status].sort().join(',') : undefined,
      service: params?.service,
      filter: params?.filter || undefined,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getSettlements(params);
      return result;
    },
    staleTime: 0, // 항상 최신 데이터 가져오기
    gcTime: 5 * 60 * 1000, // 5분 동안 캐시 유지 (이전 cacheTime)
    retry: 2,
    // 새로운 쿼리 키일 때 이전 데이터 유지하지 않음
    placeholderData: undefined,
  });

  return {
    data: query.data?.settlements,
    total: query.data?.total,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

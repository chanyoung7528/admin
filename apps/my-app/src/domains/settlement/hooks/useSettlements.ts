import { useQuery } from '@tanstack/react-query';
import { getMockSettlements, type GetSettlementsParams } from '../services/settlementService';

export function useSettlements(params?: GetSettlementsParams) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getMockSettlements(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

import { useQuery } from '@tanstack/react-query';
import { getB2BSettlement } from '../services';

export function useSettlementQuery() {
  return useQuery({
    queryKey: ['settlement'],
    queryFn: getB2BSettlement,
  });
}

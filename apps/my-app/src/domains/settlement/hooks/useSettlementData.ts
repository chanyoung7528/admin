import { useQuery } from '@tanstack/react-query';

interface Settlement {
  id: string;
  site: string;
  amount: number;
  period: string;
  status: string;
  date: string;
}

export function useSettlementData(service: 'BODY' | 'FOOD' | 'MIND') {
  return useQuery<Settlement[]>({
    queryKey: ['settlement', service],
    queryFn: async () => {
      // TODO: API 호출
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

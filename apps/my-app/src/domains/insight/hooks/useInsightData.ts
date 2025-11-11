import { useQuery } from '@tanstack/react-query';

interface InsightData {
  topAgeGroup: string;
  avgUsageTime: number;
  retentionRate: number;
}

export function useInsightData() {
  return useQuery<InsightData>({
    queryKey: ['insight'],
    queryFn: async () => {
      // TODO: API 호출
      return {
        topAgeGroup: '30-39',
        avgUsageTime: 45,
        retentionRate: 87.5,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

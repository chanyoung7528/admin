import { useQuery } from '@tanstack/react-query';

interface ReportData {
  revenue: number;
  profit: number;
  newUsers: number;
  churnRate: number;
}

export function useReportData(service: 'BODY' | 'FOOD' | 'MIND', period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
  return useQuery<ReportData>({
    queryKey: ['report', service, period],
    queryFn: async () => {
      // TODO: API 호출
      return {
        revenue: 45200000,
        profit: 12800000,
        newUsers: 234,
        churnRate: 2.4,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

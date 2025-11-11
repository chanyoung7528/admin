import { useQuery } from '@tanstack/react-query';

interface DashboardData {
  totalUsers: number;
  revenue: number;
  activeSites: number;
  usageRate: number;
}

export function useDashboardData(service: 'ALL' | 'BODY' | 'FOOD' | 'MIND') {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', service],
    queryFn: async () => {
      // TODO: API 호출
      return {
        totalUsers: 12345,
        revenue: 45000000,
        activeSites: 87,
        usageRate: 94.2,
      };
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
}

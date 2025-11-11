import { useQuery } from '@tanstack/react-query';

export function useUserInsight() {
  return useQuery({
    queryKey: ['user-insight'],
    queryFn: async () => {
      // TODO: Implement API call
      return {};
    },
  });
}

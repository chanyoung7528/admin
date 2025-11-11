import { useQuery } from '@tanstack/react-query';

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // TODO: Implement API call
      return [];
    },
  });
}

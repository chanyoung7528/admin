import { useQuery } from '@tanstack/react-query';

import { getSites } from '../services';

export function useSitesQuery() {
  return useQuery({
    queryKey: ['sites'],
    queryFn: getSites,
  });
}

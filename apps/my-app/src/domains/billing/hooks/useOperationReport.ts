import { useQuery } from '@tanstack/react-query';

import { getOperationReport } from '../services';

export function useOperationReport() {
  return useQuery({
    queryKey: ['operation-report'],
    queryFn: getOperationReport,
  });
}

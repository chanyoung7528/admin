import { useQuery } from '@tanstack/react-query';

interface Content {
  id: string;
  title: string;
  provider: string;
  type: string;
  sites: number;
  status: string;
  contractEnd: string;
}

export function useContentData() {
  return useQuery<Content[]>({
    queryKey: ['content'],
    queryFn: async () => {
      // TODO: API 호출
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

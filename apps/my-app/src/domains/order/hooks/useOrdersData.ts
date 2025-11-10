import { useQuery } from "@tanstack/react-query";

interface Order {
  id: string;
  site: string;
  items: string;
  amount: number;
  status: string;
  date: string;
}

export function useOrdersData() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      // TODO: API 호출
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}


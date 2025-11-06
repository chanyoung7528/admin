import { useQuery } from "@tanstack/react-query";
import { getBodyUsage } from "../services";

export function useBodyUsageQuery() {
  return useQuery({
    queryKey: ["body-usage"],
    queryFn: getBodyUsage,
  });
}


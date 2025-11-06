import { useQuery } from "@tanstack/react-query";
import { getMindUsage } from "../services";

export function useMindUsageQuery() {
  return useQuery({
    queryKey: ["mind-usage"],
    queryFn: getMindUsage,
  });
}


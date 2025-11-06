import { useQuery } from "@tanstack/react-query";
import { getFoodUsage } from "../services";

export function useFoodUsageQuery() {
  return useQuery({
    queryKey: ["food-usage"],
    queryFn: getFoodUsage,
  });
}


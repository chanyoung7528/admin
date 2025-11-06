import { useQuery } from "@tanstack/react-query";
import { getFoodStock } from "../services";

export function useFoodStockQuery() {
  return useQuery({
    queryKey: ["food-stock"],
    queryFn: getFoodStock,
  });
}


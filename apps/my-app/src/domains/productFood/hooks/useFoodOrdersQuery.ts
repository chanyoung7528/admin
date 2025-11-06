import { useQuery } from "@tanstack/react-query";
import { getFoodOrders } from "../services";

export function useFoodOrdersQuery() {
  return useQuery({
    queryKey: ["food-orders"],
    queryFn: getFoodOrders,
  });
}


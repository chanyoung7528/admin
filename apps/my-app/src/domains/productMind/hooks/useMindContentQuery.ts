import { useQuery } from "@tanstack/react-query";
import { getMindContent } from "../services";

export function useMindContentQuery() {
  return useQuery({
    queryKey: ["mind-content"],
    queryFn: getMindContent,
  });
}


import { useQuery } from "@tanstack/react-query";
import { getContractInfo } from "../services";

export function useContractInfo() {
  return useQuery({
    queryKey: ["contract-info"],
    queryFn: getContractInfo,
  });
}


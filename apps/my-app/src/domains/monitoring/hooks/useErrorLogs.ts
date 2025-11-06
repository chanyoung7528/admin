import { useQuery } from "@tanstack/react-query";
import { getErrorLogs } from "../services";

export function useErrorLogs() {
  return useQuery({
    queryKey: ["error-logs"],
    queryFn: getErrorLogs,
    refetchInterval: 60000, // 1분마다 자동 갱신
  });
}


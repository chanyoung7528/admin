import { useQuery } from "@tanstack/react-query";
import { getDeviceStatus } from "../services";

export function useDeviceStatus() {
  return useQuery({
    queryKey: ["device-status"],
    queryFn: getDeviceStatus,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
}


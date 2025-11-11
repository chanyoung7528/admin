import { useQuery } from '@tanstack/react-query';
import { getDeviceStatus } from '../services';

interface Device {
  name: string;
  location: string;
  status: 'online' | 'warning' | 'error';
}

interface DeviceStatusResponse {
  total: number;
  online: number;
  warning: number;
  error: number;
  devices: Device[];
}

export function useDeviceStatus() {
  return useQuery<DeviceStatusResponse>({
    queryKey: ['device-status'],
    queryFn: getDeviceStatus,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });
}

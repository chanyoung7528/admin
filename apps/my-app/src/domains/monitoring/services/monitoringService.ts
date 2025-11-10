interface Device {
  name: string;
  location: string;
  status: "online" | "warning" | "error";
}

interface DeviceStatusResponse {
  total: number;
  online: number;
  warning: number;
  error: number;
  devices: Device[];
}

// 기기 상태 조회
export async function getDeviceStatus(): Promise<DeviceStatusResponse> {
  // TODO: Implement API call
  return {
    total: 234,
    online: 218,
    warning: 12,
    error: 4,
    devices: [
      { name: "MY BODY 기기 #001", location: "서울점", status: "online" as const },
      { name: "MY BODY 기기 #002", location: "강남점", status: "online" as const },
      { name: "MY FOOD 기기 #001", location: "판교점", status: "warning" as const },
      { name: "MY MIND 기기 #001", location: "홍대점", status: "error" as const },
    ],
  };
}

// 에러 로그 조회
export async function getErrorLogs() {
  // TODO: Implement API call
  return [
    {
      message: "네트워크 연결 끊김",
      device: "MY BODY #003",
      timestamp: "2025-01-15 14:30:22",
      severity: "High",
    },
    {
      message: "센서 오류 감지",
      device: "MY FOOD #002",
      timestamp: "2025-01-15 13:15:10",
      severity: "Medium",
    },
  ];
}


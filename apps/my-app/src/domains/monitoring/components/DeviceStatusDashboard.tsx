import { useDeviceStatus } from '../hooks';

interface Device {
  name: string;
  location: string;
  status: 'online' | 'warning' | 'error';
}

export default function DeviceStatusDashboard() {
  const { data, isLoading } = useDeviceStatus();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-muted-foreground text-sm font-medium">전체 기기</h3>
          <p className="mt-2 text-3xl font-bold">{data?.total || 0}</p>
        </div>
        <div className="bg-card rounded-lg border border-green-500 p-6">
          <h3 className="text-muted-foreground text-sm font-medium">정상 작동</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{data?.online || 0}</p>
        </div>
        <div className="bg-card rounded-lg border border-yellow-500 p-6">
          <h3 className="text-muted-foreground text-sm font-medium">점검 필요</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{data?.warning || 0}</p>
        </div>
        <div className="bg-card rounded-lg border border-red-500 p-6">
          <h3 className="text-muted-foreground text-sm font-medium">오류 발생</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{data?.error || 0}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">실시간 기기 상태</h2>
        {isLoading ? (
          <p className="text-muted-foreground">로딩 중...</p>
        ) : (
          <div className="space-y-2">
            {data?.devices?.map((device: Device, index: number) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-muted-foreground text-sm">{device.location}</p>
                </div>
                <span
                  className={`h-3 w-3 rounded-full ${
                    device.status === 'online' ? 'bg-green-500' : device.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            )) || <p className="text-muted-foreground">기기 정보 없음</p>}
          </div>
        )}
      </div>
    </div>
  );
}

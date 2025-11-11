import { useErrorLogs } from '../hooks';

export default function ErrorLogViewer() {
  const { data, isLoading } = useErrorLogs();

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">에러 로그</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-2">
          {data && data.length > 0 ? (
            data.map((log, index) => (
              <div key={index} className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-red-900">{log.message}</p>
                    <p className="mt-1 text-sm text-red-700">
                      기기: {log.device} • {log.timestamp}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-200 px-2 py-1 text-xs text-red-900">{log.severity}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">에러 로그가 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}

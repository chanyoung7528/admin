import { api } from '@repo/core/api';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/report/')({
  component: ReportPage,
});

function ReportPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/order-management/online/list', {
          params: {
            page: 1,
            size: 50,
            ordrRqstDvcd: 10,
            tfbzId: 'DF0002',
            ordrStusDvcdList: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110].join(','),
            setlStusDvcdList: [10, 20, 30, 40, 50].join(','),
            periodType: 10,
            startDt: '2024-11-25',
            endDt: '2025-11-24',
          },
        });
        console.log('API Response:', data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">운영 현황 리포트</h1>
        <p className="text-muted-foreground">Site별 운영 현황 및 정산 리포트</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Site별 리포트</h2>
        <p className="text-muted-foreground">Site별 운영 현황 테이블 구현 예정</p>
      </div>
    </div>
  );
}

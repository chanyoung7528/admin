import { createFileRoute } from '@tanstack/react-router';

import { ReportSection } from '@/domains/report/components';

export const Route = createFileRoute('/_authenticated/my-food/report')({
  component: FoodReportPage,
});

function FoodReportPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD 운영 Report</h1>
        <p className="text-muted-foreground text-sm">MY FOOD B2B 운영 현황 리포트</p>
      </div>

      <ReportSection service="FOOD" period="monthly" />
    </div>
  );
}

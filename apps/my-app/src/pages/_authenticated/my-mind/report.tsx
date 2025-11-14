import { createFileRoute } from '@tanstack/react-router';
import { ReportSection } from '@/domains/report/components';

export const Route = createFileRoute('/_authenticated/my-mind/report')({
  component: MindReportPage,
});

function MindReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND 운영 Report</h1>
        <p className="text-muted-foreground">MY MIND B2B 운영 현황 리포트</p>
      </div>

      <ReportSection service="MIND" period="monthly" />
    </div>
  );
}

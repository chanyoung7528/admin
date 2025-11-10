import { createFileRoute } from "@tanstack/react-router";
import { ReportSection } from "@/domains/report/components";

export const Route = createFileRoute("/my-body/report")({
  component: BodyReportPage,
});

function BodyReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 운영 Report</h1>
        <p className="text-muted-foreground">MY BODY 운영 현황 리포트</p>
      </div>

      <ReportSection service="BODY" period="monthly" />
    </div>
  );
}

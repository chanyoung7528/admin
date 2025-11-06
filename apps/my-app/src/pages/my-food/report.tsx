import { createFileRoute } from "@tanstack/react-router";
import { OperationReport } from "../../domains/billing/components";

export const Route = createFileRoute("/my-food/report")({
  component: FoodReportPage,
});

function FoodReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD 운영 Report</h1>
        <p className="text-muted-foreground">MY FOOD B2B 운영 현황 리포트</p>
      </div>

      <OperationReport />
    </div>
  );
}

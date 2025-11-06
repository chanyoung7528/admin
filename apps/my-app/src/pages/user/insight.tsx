import { createFileRoute } from "@tanstack/react-router";
import { UserInsightChart } from "../../domains/user/components";

export const Route = createFileRoute("/user/insight")({
  component: UserInsightPage,
});

function UserInsightPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 Insight</h1>
        <p className="text-muted-foreground">
          사용자 행동 분석 및 인사이트를 제공합니다
        </p>
      </div>

      <UserInsightChart />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { ContentContractInfo } from "../../domains/productMind/components";

export const Route = createFileRoute("/my-mind/contract")({
  component: MindContractPage,
});

function MindContractPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">콘텐츠 계약/제공 내역</h1>
        <p className="text-muted-foreground">
          MY MIND 콘텐츠 계약 및 제공 현황
        </p>
      </div>

      <ContentContractInfo />
    </div>
  );
}

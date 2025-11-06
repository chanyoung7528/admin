import { createFileRoute } from "@tanstack/react-router";
import { InquiryList } from "../../domains/inquiry/components";

export const Route = createFileRoute("/my-mind/inquiry")({
  component: MindInquiryPage,
});

function MindInquiryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND 1:1 문의</h1>
        <p className="text-muted-foreground">MY MIND 관련 문의를 관리합니다</p>
      </div>

      <InquiryList />
    </div>
  );
}

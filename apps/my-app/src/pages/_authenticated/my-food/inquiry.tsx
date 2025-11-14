import { createFileRoute } from '@tanstack/react-router';
import { InquiryList } from '@/domains/inquiry/components';

export const Route = createFileRoute('/_authenticated/my-food/inquiry')({
  component: FoodInquiryPage,
});

function FoodInquiryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD 1:1 문의</h1>
        <p className="text-muted-foreground">MY FOOD 관련 문의를 관리합니다</p>
      </div>

      <InquiryList />
    </div>
  );
}

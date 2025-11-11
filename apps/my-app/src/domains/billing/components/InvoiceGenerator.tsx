import { useState } from 'react';
import { Button } from '@ui/button';

export default function InvoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement invoice generation logic
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">계산서 생성</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">기간 선택</label>
          <div className="flex gap-2">
            <input type="date" className="rounded-md border px-3 py-2" placeholder="시작일" />
            <input type="date" className="rounded-md border px-3 py-2" placeholder="종료일" />
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? '생성 중...' : '계산서 생성'}
        </Button>
      </div>
    </div>
  );
}

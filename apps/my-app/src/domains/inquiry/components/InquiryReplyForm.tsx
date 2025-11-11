import { useState } from 'react';
import { Button } from '@ui/button';
import { useSendReply } from '../hooks';

export default function InquiryReplyForm({ inquiryId }: { inquiryId: string }) {
  const [reply, setReply] = useState('');
  const { mutate: sendReply, isPending } = useSendReply();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendReply(
      { inquiryId, reply },
      {
        onSuccess: () => {
          setReply('');
          alert('답변이 전송되었습니다');
        },
      }
    );
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">답변 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">답변 내용</label>
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            className="mt-2 w-full rounded-md border p-3"
            rows={5}
            placeholder="답변을 입력하세요..."
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? '전송 중...' : '답변 전송'}
        </Button>
      </form>
    </div>
  );
}

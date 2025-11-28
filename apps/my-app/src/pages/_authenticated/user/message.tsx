import { createFileRoute } from '@tanstack/react-router';

import { MessageForm } from '@/domains/user/components';

export const Route = createFileRoute('/_authenticated/user/message')({
  component: UserMessagePage,
});

function UserMessagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">메시지 발송</h1>
        <p className="text-muted-foreground">사용자에게 메시지를 발송합니다</p>
      </div>

      <MessageForm />
    </div>
  );
}

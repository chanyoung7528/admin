import { createFileRoute } from '@tanstack/react-router';
import { UserForm } from '../../domains/user/components';

export const Route = createFileRoute('/user/register')({
  component: UserRegisterPage,
});

function UserRegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">신규회원 등록</h1>
        <p className="text-muted-foreground">새로운 회원을 등록합니다</p>
      </div>

      <UserForm />
    </div>
  );
}

import { Button, Input } from '@repo/shared/components/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    navigate({ to: '/' });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">관리자 로그인</h1>
          <p className="text-muted-foreground mt-2">관리자 계정으로 로그인하세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일
            </label>
            <Input id="email" type="email" placeholder="admin@example.com" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { Button, Input } from '@repo/shared/components/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setTokens } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 실제 로그인 API 호출
    // const { token } = await loginAPI({ email, password });

    // 임시: 토큰을 auth store에 저장
    await setTokens({
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    });

    // 로그인 후 대시보드로 이동
    navigate({ to: '/' });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
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

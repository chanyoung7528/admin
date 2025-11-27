import { LoginForm } from '@/domains/auth/components/LoginForm';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_public/login' });

  const handleLoginSuccess = () => {
    const redirectTo = (search as { redirect?: string }).redirect || '/';
    navigate({ to: redirectTo });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card w-full max-w-md space-y-8 rounded-lg border p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">관리자 로그인</h1>
          <p className="text-muted-foreground mt-2">관리자 계정으로 로그인하세요</p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
